"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getAuthMadrasaId } from "./students";

export async function getClasses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
  return data;
}

export async function createClass(prevState: any, formData: FormData) {
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
  const description = formData.get("description") as string;

  if (!name) {
    return { error: "Name is required." };
  }

  const { error } = await supabase.from("classes").insert({
    madrasa_id: finalMadrasaId,
    name,
    description,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/classes");
  return { success: true };
}

export async function deleteClass(classId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("classes")
    .delete()
    .eq("id", classId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/classes");
  return { success: true };
}
