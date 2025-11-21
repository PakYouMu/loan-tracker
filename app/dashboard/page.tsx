import { getUserRole } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { BorrowerList } from "@/components/dashboard/borrower-list";
import { ActiveLoansTable } from "@/components/dashboard/active-loans-table"; // Import New Table

export default async function DashboardPage() {
  const role = await getUserRole();
  if (!role) redirect("/auth/login");

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {role === 'superuser' ? 'Boss' : 'Admin'}.
          </p>
        </div>
      </header>

      {/* 1. Money Overview */}
      <OverviewHeader />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* 2. Main Content: Active Loans (Takes up 3 columns on large screens) */}
        <div className="xl:col-span-3 space-y-6">
           <ActiveLoansTable />
        </div>

        {/* 3. Sidebar: Borrower Directory (Takes up 1 column) */}
        <div className="space-y-6">
          <BorrowerList />
        </div>
      </div>
    </div>
  );
}