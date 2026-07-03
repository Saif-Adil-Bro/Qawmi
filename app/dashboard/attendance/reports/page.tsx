"use client";

import { useState, useEffect } from "react";
import { getAttendanceReport } from "@/app/actions/attendance";
import { format } from "date-fns";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";

export default function AttendanceReportPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const [month, setMonth] = useState<string>(currentMonth.toString());
  const [year, setYear] = useState<string>(currentYear.toString());
  const [type, setType] = useState<'student' | 'teacher'>('student');
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      const reportData = await getAttendanceReport(month, year, type);
      setData(reportData);
      setLoading(false);
    }
    loadReport();
  }, [month, year, type]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 print:hidden">
        <Link
          href="/dashboard/attendance"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">উপস্থিতি রিপোর্ট</h1>
          <p className="text-slate-500 text-sm">মাসিক উপস্থিতির পরিসংখ্যান</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 print:shadow-none print:border-none print:p-0">
        <div className="flex flex-col md:flex-row gap-4 items-end mb-6 print:hidden">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-slate-700 mb-1">রিপোর্টের ধরন</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as 'student' | 'teacher')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            >
              <option value="student">শিক্ষার্থী</option>
              <option value="teacher">শিক্ষক ও স্টাফ</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-slate-700 mb-1">মাস</label>
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            >
              <option value="1">জানুয়ারি</option>
              <option value="2">ফেব্রুয়ারি</option>
              <option value="3">মার্চ</option>
              <option value="4">এপ্রিল</option>
              <option value="5">মে</option>
              <option value="6">জুন</option>
              <option value="7">জুলাই</option>
              <option value="8">আগস্ট</option>
              <option value="9">সেপ্টেম্বর</option>
              <option value="10">অক্টোবর</option>
              <option value="11">নভেম্বর</option>
              <option value="12">ডিসেম্বর</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-slate-700 mb-1">বছর</label>
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            >
              <option value={(currentYear - 1).toString()}>{currentYear - 1}</option>
              <option value={currentYear.toString()}>{currentYear}</option>
              <option value={(currentYear + 1).toString()}>{currentYear + 1}</option>
            </select>
          </div>
          
          <div className="ml-auto w-full md:w-auto">
            <button 
              onClick={handlePrint}
              className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition font-medium"
            >
              <FileText className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        <div className="hidden print:block mb-6 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            {type === 'student' ? 'শিক্ষার্থীদের' : 'শিক্ষক ও স্টাফদের'} মাসিক উপস্থিতি রিপোর্ট
          </h2>
          <p className="text-slate-600 mt-1">
            {month} / {year}
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">রিপোর্ট তৈরি হচ্ছে...</div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center text-slate-500">কোনো তথ্য পাওয়া যায়নি।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-medium border-b print:bg-white print:border-b-2 print:border-black">
                <tr>
                  <th className="px-4 py-3 print:border print:border-slate-300">নাম</th>
                  {type === 'student' && <th className="px-4 py-3 print:border print:border-slate-300">ক্লাস</th>}
                  {type === 'student' && <th className="px-4 py-3 print:border print:border-slate-300">রোল</th>}
                  {type === 'teacher' && <th className="px-4 py-3 print:border print:border-slate-300">পদবী</th>}
                  <th className="px-4 py-3 text-center print:border print:border-slate-300 text-emerald-600">উপস্থিত</th>
                  <th className="px-4 py-3 text-center print:border print:border-slate-300 text-red-600">অনুপস্থিত</th>
                  <th className="px-4 py-3 text-center print:border print:border-slate-300 text-amber-600">দেরি</th>
                  <th className="px-4 py-3 text-center print:border print:border-slate-300 text-purple-600">ছুটি</th>
                  <th className="px-4 py-3 text-center print:border print:border-slate-300">মোট দিন</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-600">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition print:hover:bg-white">
                    <td className="px-4 py-3 font-medium text-slate-900 print:border print:border-slate-300">
                      {item.first_name} {item.last_name}
                    </td>
                    {type === 'student' && <td className="px-4 py-3 print:border print:border-slate-300">{item.classes?.name || '-'}</td>}
                    {type === 'student' && <td className="px-4 py-3 print:border print:border-slate-300">{item.roll_number || '-'}</td>}
                    {type === 'teacher' && <td className="px-4 py-3 print:border print:border-slate-300">{item.designation || '-'}</td>}
                    
                    <td className="px-4 py-3 text-center font-medium text-emerald-600 print:border print:border-slate-300">{item.stats.present}</td>
                    <td className="px-4 py-3 text-center font-medium text-red-600 print:border print:border-slate-300">{item.stats.absent}</td>
                    <td className="px-4 py-3 text-center font-medium text-amber-600 print:border print:border-slate-300">{item.stats.late}</td>
                    <td className="px-4 py-3 text-center font-medium text-purple-600 print:border print:border-slate-300">{item.stats.leave}</td>
                    <td className="px-4 py-3 text-center font-medium text-slate-900 print:border print:border-slate-300">{item.stats.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
