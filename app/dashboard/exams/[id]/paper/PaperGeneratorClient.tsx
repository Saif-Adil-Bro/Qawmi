"use client";

import { useState, useRef, useEffect } from "react";
import { getExamPaper, saveExamPaper } from "@/app/actions/questions";
import { Plus, Trash2, Printer, Loader2, Save, FileSignature, CheckCircle2 } from "lucide-react";

export default function PaperGeneratorClient({
  examId,
  classes,
  subjects,
  questions,
  exam,
  madrasa
}: {
  examId: string;
  classes: any[];
  subjects: any[];
  questions: any[];
  exam: any;
  madrasa: any;
}) {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [paperTitle, setPaperTitle] = useState("Final Exam Paper");
  const [totalMarks, setTotalMarks] = useState(100);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  // Available questions for selected class and subject
  const availableQuestions = questions.filter(
    (q) => q.class_id === classId && q.subject_id === subjectId
  );

  useEffect(() => {
    if (classId && subjectId) {
      loadPaper();
    } else {
      setSelectedQuestions([]);
    }
  }, [classId, subjectId]);

  const loadPaper = async () => {
    setLoading(true);
    const paper = await getExamPaper(examId, classId, subjectId);
    if (paper) {
      setPaperTitle(paper.title);
      setTotalMarks(paper.total_marks);
      setSelectedQuestions(paper.questions || []);
    } else {
      setPaperTitle(`${exam.title} - Question Paper`);
      setTotalMarks(100);
      setSelectedQuestions([]);
    }
    setLoading(false);
  };

  const handleToggleQuestion = (question: any) => {
    const isSelected = selectedQuestions.some((q) => q.id === question.id);
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter((q) => q.id !== question.id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const currentTotalMarks = selectedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

  const handleSave = async () => {
    if (!classId || !subjectId) {
      alert("Please select Class and Subject first");
      return;
    }
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question");
      return;
    }
    setSaving(true);
    const result = await saveExamPaper({
      exam_id: examId,
      class_id: classId,
      subject_id: subjectId,
      title: paperTitle,
      total_marks: totalMarks,
      questions: selectedQuestions
    });
    if (result.error) {
      alert(result.error);
    } else {
      alert("Exam paper saved successfully!");
    }
    setSaving(false);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = printRef.current.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-1/2">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 outline-none text-sm"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 outline-none text-sm"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <button
            onClick={handleSave}
            disabled={saving || loading || !classId || !subjectId}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition disabled:opacity-50 flex-1 md:flex-none justify-center"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Paper</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={selectedQuestions.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition disabled:opacity-50 flex-1 md:flex-none justify-center"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : classId && subjectId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Question Bank Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-slate-800">Question Bank</h3>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {availableQuestions.length} Available
              </span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {availableQuestions.map((q) => {
                const isSelected = selectedQuestions.some((sq) => sq.id === q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isSelected 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded text-slate-600">
                          {q.question_type}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{q.marks} Marks</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">{q.question_text}</p>
                    {q.question_type === "MCQ" && q.options && (
                      <div className="mt-2 text-xs text-slate-500 grid grid-cols-2 gap-1">
                        {q.options.map((opt: string, i: number) => (
                          <div key={i}>• {opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {availableQuestions.length === 0 && (
                <div className="text-center p-8 text-slate-500 text-sm">
                  No questions found for this class and subject in the Question Bank.
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Paper Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center">
                  <FileSignature className="w-4 h-4 mr-2" /> 
                  Paper Preview
                </h3>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${currentTotalMarks > totalMarks ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {currentTotalMarks} / {totalMarks} Marks
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 outline-none text-sm w-full"
                  placeholder="Paper Title"
                />
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 outline-none text-sm w-full"
                  placeholder="Total Marks"
                />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div className="bg-white p-6 shadow-sm border border-slate-200 min-h-full" style={{ fontFamily: 'sans-serif' }}>
                <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                  <h1 className="text-2xl font-bold mb-1">{madrasa?.name || 'Madrasa Name'}</h1>
                  <h2 className="text-lg font-semibold">{paperTitle}</h2>
                  <div className="flex justify-between text-sm mt-4 font-medium">
                    <span>Class: {classes.find((c) => c.id === classId)?.name}</span>
                    <span>Subject: {subjects.find((s) => s.id === subjectId)?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1 font-medium">
                    <span>Time: _________</span>
                    <span>Full Marks: {totalMarks}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedQuestions.length === 0 ? (
                    <div className="text-center p-8 text-slate-400 italic">
                      Select questions from the left panel to add to this paper.
                    </div>
                  ) : (
                    selectedQuestions.map((q, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="font-semibold">{idx + 1}.</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-slate-900">{q.question_text}</p>
                            <span className="text-sm font-semibold ml-4">[{q.marks}]</span>
                          </div>
                          {q.question_type === "MCQ" && q.options && (
                            <div className="grid grid-cols-2 gap-2 mt-3 ml-2">
                              {q.options.map((opt: string, i: number) => (
                                <div key={i} className="flex items-center text-sm">
                                  <span className="mr-2">({String.fromCharCode(97 + i)})</span> {opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-200">
          <FileSignature className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600">Select Class and Subject</h3>
          <p className="text-slate-400">Choose a class and subject above to start generating a question paper.</p>
        </div>
      )}

      {/* Hidden Print Layout */}
      <div className="hidden">
        <div ref={printRef} className="p-8 max-w-4xl mx-auto text-slate-900" style={{ fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
          <div className="text-center border-b-[3px] border-black pb-4 mb-6">
            <h1 className="text-3xl font-bold mb-2">{madrasa?.name || 'Madrasa Name'}</h1>
            {madrasa?.address && <p className="text-base mb-2">{madrasa.address}</p>}
            <h2 className="text-xl font-bold mb-2">{paperTitle}</h2>
            
            <div className="flex justify-between text-base mt-6 font-bold px-4">
              <span>Class: {classes.find((c) => c.id === classId)?.name}</span>
              <span>Subject: {subjects.find((s) => s.id === subjectId)?.name}</span>
            </div>
            <div className="flex justify-between text-base mt-2 font-bold px-4">
              <span>Time: ______________</span>
              <span>Full Marks: {totalMarks}</span>
            </div>
          </div>

          <div className="space-y-6 px-4">
            {selectedQuestions.map((q, idx) => (
              <div key={idx} className="flex gap-4 break-inside-avoid">
                <div className="font-bold text-lg">{idx + 1}.</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-lg leading-relaxed">{q.question_text}</p>
                    <span className="text-base font-bold ml-4">[{q.marks}]</span>
                  </div>
                  {q.question_type === "MCQ" && q.options && (
                    <div className="grid grid-cols-2 gap-4 mt-4 ml-2">
                      {q.options.map((opt: string, i: number) => (
                        <div key={i} className="flex items-center text-base">
                          <span className="mr-2 font-medium">({String.fromCharCode(97 + i)})</span> {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
