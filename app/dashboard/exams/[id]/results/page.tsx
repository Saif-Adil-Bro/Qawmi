import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getExamById } from "@/app/actions/exams";
import { getClasses } from "@/app/actions/students";
import { notFound } from "next/navigation";
import ExamResultsClient from "./ExamResultsClient";

export default async function ExamResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;
  
  const [exam, classes] = await Promise.all([
    getExamById(examId),
    getClasses()
  ]);

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 print:hidden">
        <Link
          href="/dashboard/exams"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ফলাফল / মার্কশিট</h1>
          <p className="text-slate-500 text-sm">{exam.title} - {exam.year}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 print:shadow-none print:border-none print:p-0">
        <ExamResultsClient examId={examId} classes={classes} examTitle={exam.title} examYear={exam.year} />
      </div>
    </div>
  );
}
