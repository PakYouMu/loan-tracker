import { getWalletBalance, getLoanStats } from "@/app/actions/wallet";
import { AddCapitalDialog } from "./add-capital-dialog";
import { Wallet, PiggyBank, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // npx shadcn@latest add card

export async function OverviewHeader() {
  // Fetch data in parallel for speed
  const [balance, stats] = await Promise.all([
    getWalletBalance(),
    getLoanStats()
  ]);

  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      
      {/* CARD 1: CASH ON HAND */}
      <Card className="border-l-4 border-l-emerald-500 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cash On-Hand
          </CardTitle>
          <Wallet className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatter.format(balance)}</div>
          <p className="text-xs text-muted-foreground mb-4">
            Available to lend
          </p>
          <AddCapitalDialog />
        </CardContent>
      </Card>

      {/* CARD 2: OUTSTANDING RECEIVABLES */}
      <Card className="border-l-4 border-l-blue-500 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Outstanding Receivables
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatter.format(stats.totalReceivables)}</div>
          <p className="text-xs text-muted-foreground">
            Principal + Interest due
          </p>
          <div className="mt-4 h-9 flex items-center text-xs font-medium text-blue-600 bg-blue-50 w-fit px-2 rounded">
             Net Worth: {formatter.format(balance + stats.totalReceivables)}
          </div>
        </CardContent>
      </Card>

      {/* CARD 3: ACTIVE LOANS */}
      <Card className="border-l-4 border-l-orange-500 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Borrowers
          </CardTitle>
          <Users className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeCount}</div>
          <p className="text-xs text-muted-foreground">
            Open contracts
          </p>
        </CardContent>
      </Card>

    </div>
  );
}