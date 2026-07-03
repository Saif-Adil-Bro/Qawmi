"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function registerMadrasa(formData: FormData) {
  const madrasaName = formData.get("madrasaName") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const adminName = formData.get("adminName") as string;
  const adminEmail = formData.get("adminEmail") as string;
  const adminPassword = formData.get("adminPassword") as string;

  if (!madrasaName || !contactEmail || !adminName || !adminEmail || !adminPassword) {
    return { error: "All fields are required" };
  }

  const supabase = await createAdminClient();

  // 1. Create the Madrasa record (Tenant)
  const { data: madrasaData, error: madrasaError } = await supabase
    .from("madrasas")
    .insert({
      name: madrasaName,
      contact_email: contactEmail,
      subscription_plan: "free",
    })
    .select("id")
    .single();

  if (madrasaError || !madrasaData) {
    return { error: madrasaError?.message || "Failed to create madrasa" };
  }

  const madrasaId = madrasaData.id;

  // 2. Create the Admin User in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    // Rollback madrasa creation on fail
    await supabase.from("madrasas").delete().eq("id", madrasaId);
    return { error: authError?.message || "Failed to create auth user" };
  }

  const authUserId = authData.user.id;

  // 3. Create the User record in public schema
  const { error: userError } = await supabase
    .from("users")
    .insert({
      id: authUserId,
      madrasa_id: madrasaId,
      role: "super_admin", // Given they are the creator, they could be super_admin or admin
      full_name: adminName,
      email: adminEmail,
    });

  if (userError) {
    // Rollback if failed
    await supabase.auth.admin.deleteUser(authUserId);
    await supabase.from("madrasas").delete().eq("id", madrasaId);
    return { error: userError.message || "Failed to create user profile" };
  }

  return { success: true, message: "Madrasa registered successfully!" };
}
