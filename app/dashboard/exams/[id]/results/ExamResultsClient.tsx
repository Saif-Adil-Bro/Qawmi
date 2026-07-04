"use client";

import { useState } from "react";
import { getStudentReportCard } from "@/app/actions/exams";
import { FileText } from "lucide-react";

export default function ExamResultsClient({ 
  examId, 
  classes, 
  examTitle, 
  examYear 
}: { 
  examId: string, 
  classes: { id: string, name: string }[],
  examTitle: string,
  examYear: string
}) {
  const [classId, setClassId] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadResults = async () => {
    setLoading(true);
    const data = await getStudentReportCard(examId, classId || undefined);
    // Sort by percentage descending
    const sortedData = data.sort((a, b) => Number(b.percentage) - Number(a.percentage));
    setResults(sortedData);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };
  
  const selectedClassName = classes.find(c => c.id === classId)?.name || '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100 print:hidden">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-slate-700 mb-1">ক্লাস (ঐচ্ছিক)</label>
          <select 
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition bg-white"
          >
            <option value="">সব ক্লাস</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto flex space-x-3">
          <button 
            onClick={loadResults}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition text-sm font-medium"
          >
            {loading ? "খুঁজছি..." : "ফলাফল দেখুন"}
          </button>
          
          <button 
            onClick={handlePrint}
            disabled={results.length === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition font-medium text-sm disabled:opacity-50 bg-white"
          >
            <FileText className="w-4 h-4" />
            <span>প্রিন্ট</span>
          </button>
        </div>
      </div>

      <div className="hidden print:block mb-8 text-center border-b pb-4 border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900">{examTitle} - {examYear}</h2>
        <p className="text-slate-600 mt-1 text-lg">
          ফলাফল তালিকা {selectedClassName ? `(${selectedClassName})` : ''}
        </p>
      </div>

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b print:bg-white print:border-b-2 print:border-black">
              <tr>
                <th className="px-4 py-3 print:border print:border-slate-300">মেধা স্থান</th>
                <th className="px-4 py-3 print:border print:border-slate-300">রোল</th>
                <th className="px-4 py-3 print:border print:border-slate-300">নাম</th>
                {!classId && <th className="px-4 py-3 print:border print:border-slate-300">ক্লাস</th>}
                <th className="px-4 py-3 text-center print:border print:border-slate-300">মোট নম্বর</th>
                <th className="px-4 py-3 text-center print:border print:border-slate-300">প্রাপ্ত নম্বর</th>
                <th className="px-4 py-3 text-center print:border print:border-slate-300">শতকরা</th>
                <th className="px-4 py-3 text-center print:border print:border-slate-300">বিভাগ (Grade)</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {results.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition print:hover:bg-white">
                  <td className="px-4 py-3 text-center font-bold text-slate-900 print:border print:border-slate-300">{index + 1}</td>
                  <td className="px-4 py-3 print:border print:border-slate-300">{student.roll_number || '-'}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 print:border print:border-slate-300">
                    {student.first_name} {student.last_name}
                  </td>
                  {!classId && <td className="px-4 py-3 print:border print:border-slate-300">{student.class_name}</td>}
                  <td className="px-4 py-3 text-center print:border print:border-slate-300">{student.totalMax}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-800 print:border print:border-slate-300">{student.totalObtained}</td>
                  <td className="px-4 py-3 text-center print:border print:border-slate-300">{student.percentage}%</td>
                  <td className="px-4 py-3 text-center font-medium print:border print:border-slate-300">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium print:border-none print:p-0 print:text-black ${
                      student.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      student.percentage >= 60 ? 'bg-blue-100 text-blue-800' :
                      student.percentage >= 45 ? 'bg-amber-100 text-amber-800' :
                      student.percentage >= 33 ? 'bg-slate-100 text-slate-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && results.length === 0 && classId !== "" && (
        <div className="text-center py-12 text-slate-500">
          কোনো ফলাফল পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}
