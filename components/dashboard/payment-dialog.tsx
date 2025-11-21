"use client";

import { useState } from "react";
import { recordPayment } from "@/app/actions/payments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Loader2 } from "lucide-react";

interface PaymentDialogProps {
  loanId: string;
  borrowerName: string;
  amortization: number; // The suggested amount (e.g. 1,425)
  balance: number;
}

export function PaymentDialog({ loanId, borrowerName, amortization, balance }: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    formData.append("loan_id", loanId);
    
    try {
      await recordPayment(formData);
      setOpen(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Banknote className="h-4 w-4" />
          Pay
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Collecting from <strong>{borrowerName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-muted rounded-md text-center">
                <span className="text-xs text-muted-foreground block">Due per Payday</span>
                <span className="font-bold text-lg">₱{amortization.toLocaleString()}</span>
             </div>
             <div className="p-3 bg-muted rounded-md text-center">
                <span className="text-xs text-muted-foreground block">Remaining Balance</span>
                <span className="font-bold text-lg text-red-600">₱{balance.toLocaleString()}</span>
             </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount Collected (₱)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={amortization} // Auto-fill with the expected amount
              max={balance} // Don't allow overpayment
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" name="notes" placeholder="e.g. GCash, Cash, Payment #1" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}