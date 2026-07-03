"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getClassSubjects(classId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_subjects")
    .select("*, subjects(*)")
    .eq("class_id", classId);

  if (error) {
    console.error("Error fetching class subjects:", error);
    return [];
  }
  return data;
}

export async function assignSubjectToClass(classId: string, subjectId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { getAuthMadrasaId } = await import("./students");
  const finalMadrasaId = await getAuthMadrasaId(supabase, user);
  if (!finalMadrasaId) {
    return { error: "No Madrasa exists in the system." };
  }

  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminClient = await createAdminClient();

  const { error } = await adminClient.from("class_subjects").insert({
    madrasa_id: finalMadrasaId,
    class_id: classId,
    subject_id: subjectId,
  });

  if (error) {
    if (error.code === '23505') {
      return { error: "Subject is already assigned to this class." };
    }
    return { error: error.message };
  }

  revalidatePath(`/dashboard/classes/${classId}/subjects`);
  return { success: true };
}

export async function removeSubjectFromClass(classSubjectId: string, classId: string) {
  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminClient = await createAdminClient();
  
  const { error } = await adminClient
    .from("class_subjects")
    .delete()
    .eq("id", classSubjectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/classes/${classId}/subjects`);
  return { success: true };
}
