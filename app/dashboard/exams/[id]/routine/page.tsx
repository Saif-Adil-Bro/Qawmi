import Link from "next/link";
import { ArrowLeft, Settings, List, Trophy, Printer } from "lucide-react";
import { getExamById } from "@/app/actions/exams";
import { getClasses } from "@/app/actions/students";
import { getSubjects } from "@/app/actions/subjects";
import { getExamRoutines } from "@/app/actions/exam-routines";
import { getMadrasaDetails as getMadrasaInfo } from "@/app/actions/tenant";
import { notFound } from "next/navigation";
import ExamRoutineClient from "./ExamRoutineClient";

export default async function ExamRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;
  
  const [exam, classes, subjects, routines, madrasa] = await Promise.all([
    getExamById(examId),
    getClasses(),
    getSubjects(),
    getExamRoutines(examId),
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
          <p className="text-slate-500 text-sm">Exam Routine Management</p>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-slate-200">
        <Link
          href={`/dashboard/exams/${examId}/setup`}
          className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Setup Subjects</span>
        </Link>
        <Link
          href={`/dashboard/exams/${examId}/routine`}
          className="px-4 py-3 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 flex items-center space-x-2"
        >
          <List className="w-4 h-4" />
          <span>Routine</span>
        </Link>
        <Link
          href={`/dashboard/exams/${examId}/marks`}
          className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-2"
        >
          <List className="w-4 h-4" />
          <span>Marks Entry</span>
        </Link>
        <Link
          href={`/dashboard/exams/${examId}/results`}
          className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-2"
        >
          <Trophy className="w-4 h-4" />
          <span>Results</span>
        </Link>
      </div>

      <ExamRoutineClient 
        examId={examId} 
        classes={classes} 
        subjects={subjects} 
        routines={routines} 
        exam={exam}
        madrasa={madrasa}
      />
    </div>
  );
}
