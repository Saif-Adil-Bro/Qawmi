import Link from "next/link";
import { ArrowLeft, Settings, List, Trophy, FileText, FileSignature } from "lucide-react";
import { getExamById, getExamSubjects } from "@/app/actions/exams";
import { getClasses } from "@/app/actions/students";
import { getSubjects } from "@/app/actions/subjects";
import { getQuestions } from "@/app/actions/questions";
import { getMadrasaDetails as getMadrasaInfo } from "@/app/actions/tenant";
import { notFound } from "next/navigation";
import PaperGeneratorClient from "./PaperGeneratorClient";

export default async function ExamPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;
  
  const [exam, classes, subjects, questions, madrasa] = await Promise.all([
    getExamById(examId),
    getClasses(),
    getSubjects(),
    getQuestions(), // We load all questions to filter client-side or we can fetch via API. Let's just fetch all for now, it's easier.
    getMadrasaInfo()
  ]);

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/exams"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {exam.title} - {exam.year}
          </h1>
          <p className="text-slate-500 text-sm">প্রশ্নপত্র তৈরি (Paper Generator)</p>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto">
        <Link
          href={`/dashboard/exams/${examId}/setup`}
          className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-2 whitespace-nowrap"
        >
          <Settings className="w-4 h-4" />
          <span>Setup Subjects</span>
        </Link>
        <Link
          href={`/dashboard/exams/${examId}/routine`}
          className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-2 whitespace-nowrap"
        >
          <List className="w-4 h-4" />
          <span>Routine</span>
        </Link>
        <Link
          href={`/dashboard/exams/${examId}/paper`}
          className="px-4 py-3 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 flex items-center space-x-2 whitespace-nowrap"
        >
          <FileSignature className="w-4 h-4" />
          <span>Paper Generator</span>
        </Link>
        <Link
          href={`/dashboard/exams/${examId}/marks`}
          className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-2 whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          <span>Marks Entry</span>
        </Link>
        <Link
          href={`/dashboard/exams/${examId}/results`}
          className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-2 whitespace-nowrap"
        >
          <Trophy className="w-4 h-4" />
          <span>Results</span>
        </Link>
      </div>

      <PaperGeneratorClient 
        examId={examId} 
        classes={classes} 
        subjects={subjects} 
        questions={questions}
        exam={exam}
        madrasa={madrasa}
      />
    </div>
  );
}
