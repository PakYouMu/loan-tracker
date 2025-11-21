import { createClient } from "@/lib/supabase/server";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // npx shadcn@latest add badge
import { PaymentDialog } from "./payment-dialog";
import { CreateLoanModal } from "./create-loan-modal"; // Import your new modal
import { LoanSummary } from "@/lib/types/schema"; // Ensure this path matches your types file

export async function ActiveLoansTable() {
  const supabase = await createClient();
  
  // Fetch from the View
  const { data: loans, error } = await supabase
    .from("view_loan_summary")
    .select("*")
    .eq("status", "ACTIVE") // Only show active loans
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching loans:", error);
    return <div>Error loading loans.</div>;
  }

  return (
    <div className="rounded-md border bg-card shadow-sm">
      <div className="p-4 flex items-center justify-between border-b">
        <div>
            <h3 className="font-semibold text-lg">Active Loans</h3>
            <p className="text-sm text-muted-foreground">Manage collections and balances.</p>
        </div>
        {/* This is where your Smart OCR Modal lives now */}
        <CreateLoanModal />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Borrower</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead className="text-right">Principal</TableHead>
            <TableHead className="text-right">Payday Due</TableHead>
            <TableHead className="text-right">Paid / Total</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loans || loans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No active loans. Click "New Loan" to scan a card.
              </TableCell>
            </TableRow>
          ) : (
            loans.map((loan: LoanSummary) => {
                // Calculate progress percentage for a visual bar
                const percentPaid = Math.min(100, (loan.total_paid / loan.total_due) * 100);

                return (
                <TableRow key={loan.id}>
                    <TableCell className="font-medium">
                        <div className="flex flex-col">
                            <span>{loan.last_name}, {loan.first_name}</span>
                            <span className="text-xs text-muted-foreground">{loan.duration_months} months @ {loan.interest_rate}%</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        {new Date(loan.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                        ₱{loan.principal.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                        ₱{loan.amortization_per_payday.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs">
                                ₱{loan.total_paid.toLocaleString()} / ₱{loan.total_due.toLocaleString()}
                            </span>
                            {/* Mini Progress Bar */}
                            <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500" 
                                    style={{ width: `${percentPaid}%` }} 
                                />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                        ₱{loan.remaining_balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                        <PaymentDialog 
                            loanId={loan.id} 
                            borrowerName={`${loan.first_name} ${loan.last_name}`}
                            amortization={loan.amortization_per_payday}
                            balance={loan.remaining_balance}
                        />
                    </TableCell>
                </TableRow>
                )
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}