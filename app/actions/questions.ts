"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getAuthMadrasaId } from "./students";

export async function getQuestions(classId?: string, subjectId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("question_bank")
    .select(`*, class:classes(name), subject:subjects(name)`);

  if (classId) query = query.eq("class_id", classId);
  if (subjectId) query = query.eq("subject_id", subjectId);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
  return data || [];
}

export async function saveQuestion(data: {
  class_id: string;
  subject_id: string;
  question_type: string;
  question_text: string;
  options?: any;
  marks: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const madrasaId = await getAuthMadrasaId(supabase, user);

  const { error } = await supabase.from("question_bank").insert({
    ...data,
    madrasa_id: madrasaId,
  });

  if (error) {
    console.error("Error saving question:", error);
    return { error: error.message };
  }
  revalidatePath(`/dashboard/exams/question-bank`);
  return { success: true };
}

export async function deleteQuestion(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("question_bank").delete().eq("id", id);
  if (error) {
    console.error("Error deleting question:", error);
    return { error: error.message };
  }
  revalidatePath(`/dashboard/exams/question-bank`);
  return { success: true };
}

export async function getExamPaper(examId: string, classId: string, subjectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exam_papers")
    .select("*")
    .eq("exam_id", examId)
    .eq("class_id", classId)
    .eq("subject_id", subjectId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching exam paper:", error);
  }
  return data || null;
}

export async function saveExamPaper(data: {
  exam_id: string;
  class_id: string;
  subject_id: string;
  title: string;
  total_marks: number;
  questions: any;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const madrasaId = await getAuthMadrasaId(supabase, user);

  const existing = await getExamPaper(data.exam_id, data.class_id, data.subject_id);
  
  if (existing) {
    const { error } = await supabase.from("exam_papers")
      .update({
        title: data.title,
        total_marks: data.total_marks,
        questions: data.questions
      })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("exam_papers").insert({
      ...data,
      madrasa_id: madrasaId,
    });
    if (error) return { error: error.message };
  }

  revalidatePath(`/dashboard/exams/${data.exam_id}/paper`);
  return { success: true };
}
