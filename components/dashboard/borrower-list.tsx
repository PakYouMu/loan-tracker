import { createClient } from "@/lib/supabase/server";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"; // Ensure you install this: npx shadcn@latest add table
import { AddBorrowerDialog } from "./add-borrower-dialog";
import { FileSignature } from "lucide-react";

export async function BorrowerList() {
  const supabase = await createClient();
  
  // Fetch borrowers sorted by newest first
  const { data: borrowers } = await supabase
    .from("borrowers")
    .select("*")
    .is("deleted_at", null) // Only show active borrowers
    .order("created_at", { ascending: false });

  return (
    <div className="rounded-md border bg-card">
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="font-semibold">Borrower Directory</h3>
        <AddBorrowerDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Signature</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!borrowers || borrowers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No borrowers found. Add one to start.
              </TableCell>
            </TableRow>
          ) : (
            borrowers.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  {b.last_name}, {b.first_name}
                </TableCell>
                <TableCell>
                  {new Date(b.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {b.signature_url ? (
                    <a 
                      href={b.signature_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                    >
                      <FileSignature className="h-3 w-3" /> View
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">Missing</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}