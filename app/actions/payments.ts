"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function recordPayment(formData: FormData) {
  const supabase = await createClient();

  const loanId = formData.get("loan_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const notes = formData.get("notes") as string;

  if (!loanId || !amount || amount <= 0) {
    throw new Error("Invalid payment details");
  }

  // 1. Insert Payment
  // The DB Triggers will handle: 
  //   - Updating Ledger (Money In)
  //   - Audit Logging
  //   - Calculating Views (Balance updates automatically)
  const { error } = await supabase.from("payments").insert({
    loan_id: loanId,
    amount: amount,
    // notes: notes -- If you added a notes column to payments, uncomment this. 
    // If not, it's fine, the Ledger trigger adds a default note.
  });

  if (error) {
    throw new Error("Payment failed: " + error.message);
  }

  revalidatePath("/dashboard");
}