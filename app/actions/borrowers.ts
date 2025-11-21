"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBorrower(formData: FormData) {
  const supabase = await createClient();

  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const signatureFile = formData.get("signature") as File;

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  }

  let signatureUrl = null;

  // 1. Handle File Upload (If a file was provided)
  if (signatureFile && signatureFile.size > 0) {
    // Generate a unique filename to prevent collisions
    const filename = `${Date.now()}-${signatureFile.name.replaceAll(" ", "_")}`;
    
    const { data, error: uploadError } = await supabase.storage
      .from("signatures")
      .upload(filename, signatureFile);

    if (uploadError) {
      throw new Error("Failed to upload signature: " + uploadError.message);
    }

    // Get the public URL so we can store it in the DB
    const { data: urlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(filename);
      
    signatureUrl = urlData.publicUrl;
  }

  // 2. Insert into Database
  const { error: dbError } = await supabase.from("borrowers").insert({
    first_name: firstName,
    last_name: lastName,
    signature_url: signatureUrl,
  });

  if (dbError) {
    throw new Error("Database error: " + dbError.message);
  }

  // 3. Refresh the dashboard to show the new person
  revalidatePath("/dashboard");
}