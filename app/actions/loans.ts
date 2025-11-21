"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFullLoan(formData: FormData) {
  const supabase = await createClient();

  // 1. Extract Form Data
  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const months = parseInt(formData.get("months") as string);
  const interestRate = parseFloat(formData.get("interest_rate") as string);
  const startDate = formData.get("start_date") as string;
  const signatureFile = formData.get("signature") as File;

  if (!name || !amount || !months) throw new Error("Missing fields");

  // 2. Upload Signature
  let signatureUrl = null;
  if (signatureFile && signatureFile.size > 0) {
    const filename = `sig-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from("signatures")
      .upload(filename, signatureFile);
      
    if (!uploadError) {
      const { data } = supabase.storage.from("signatures").getPublicUrl(filename);
      signatureUrl = data.publicUrl;
    }
  }

  // 3. Create Borrower (One-shot)
  // Note: In a real app, you might want to check if name exists first.
  // For now, we create a new record for every card as requested.
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "Unknown";

  const { data: borrower, error: bError } = await supabase
    .from("borrowers")
    .insert({
      first_name: firstName,
      last_name: lastName,
      signature_url: signatureUrl
    })
    .select()
    .single();

  if (bError) throw new Error("Failed to create borrower: " + bError.message);

  // 4. Create Loan
  const { error: lError } = await supabase.from("loans").insert({
    borrower_id: borrower.id,
    principal: amount,
    interest_rate: interestRate,
    duration_months: months,
    start_date: startDate
  });

  if (lError) throw new Error("Failed to create loan: " + lError.message);

  revalidatePath("/dashboard");
}