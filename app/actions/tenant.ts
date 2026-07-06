"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getAuthMadrasaId } from "./students";

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


export async function getMadrasaDetails() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const madrasaId = await getAuthMadrasaId(supabase, user);
  if (!madrasaId) return null;
  
  const { data, error } = await supabase
    .from("madrasas")
    .select("*")
    .eq("id", madrasaId)
    .single();
    
  if (error) return null;
  return data;
}

export async function updateMadrasaDetails(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "ইউজার লগইন করা নেই" };
    
    const madrasaId = await getAuthMadrasaId(supabase, user);
    if (!madrasaId) return { error: "মাদরাসা আইডি পাওয়া যায়নি" };
    
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const logoFile = formData.get("logo") as File | null;
    
    if (!name) {
      return { error: "মাদরাসার নাম অবশ্যই দিতে হবে" };
    }
    
    // Update madrasas table
    const { error: updateError } = await supabase
      .from("madrasas")
      .update({
        name,
        address,
        contact_phone: phone,
      })
      .eq("id", madrasaId);
      
    if (updateError) {
      return { error: "তথ্য আপডেট করতে ব্যর্থ হয়েছে: " + updateError.message };
    }
    
    // Upload logo if provided
    if (logoFile && logoFile.size > 0) {
      const filePath = `madrasa_logo_${madrasaId}.png`;
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, buffer, {
          contentType: logoFile.type,
          upsert: true
        });
        
      if (uploadError) {
        return { error: "লোগো আপলোড করতে ব্যর্থ হয়েছে: " + uploadError.message };
      }
    }
    
    return { success: true, message: "মাদরাসার তথ্য সফলভাবে আপডেট করা হয়েছে।" };
  } catch (error: any) {
    return { error: error?.message || "একটি অজানা সমস্যা হয়েছে" };
  }
}