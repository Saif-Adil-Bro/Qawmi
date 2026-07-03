"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getAuthMadrasaId } from "./students";

export async function getSubjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
  return data;
}

export async function createSubject(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const finalMadrasaId = await getAuthMadrasaId(supabase, user);
  if (!finalMadrasaId) {
    return { error: "No Madrasa exists in the system." };
  }

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { error: "Name is required." };
  }

  const { error } = await supabase.from("subjects").insert({
    madrasa_id: finalMadrasaId,
    name,
    code,
    description,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  return { success: true };
}

export async function deleteSubject(subjectId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", subjectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  return { success: true };
}
