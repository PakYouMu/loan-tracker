"use client";

import { useMotion } from "@/components/context/motion-context"; 
import MagicBento, { BentoCard } from "@/components/ui/magic-bento";
import { MotionToggleButton } from "@/components/ui/motion-toggle-button";
import { AddCapitalDialog } from "@/components/dashboard/modals/add-capital-dialog";
import { Wallet, TrendingUp, Activity, Users } from "lucide-react";

interface DashboardGridProps {
  role: string | null;
  balance: number;
  stats: { activeCount: number; totalReceivables: number };
  loansTable: React.ReactNode;
}

export function DashboardGrid({ 
  role, 
  balance, 
  stats, 
  loansTable
}: DashboardGridProps) {
  
  const { reduceMotion } = useMotion(); 
  const formatter = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

  return (
    <div className="h-full w-full max-w-[90rem] mx-auto p-responsive relative flex flex-col gap-responsive">
      <MagicBento 
        disableAnimations={reduceMotion}
        enableSpotlight={true}
        enableStars={true}
        enableTilt={true}
        enableMagnetism={true}
        enableBorderGlow={true}
        spotlightRadius={300}
        glowColor="16, 185, 129"
        tiltIntensity={4}
        magnetStrength={0.03}
        className="gap-responsive" 
      >
        {/* 1. Cash */}
        <BentoCard 
          className="col-span-1" 
          title="Cash On-Hand" 
          icon={<Wallet className="h-4 w-4"/>}
        >
          <div className="mt-2">
            <div className="text-responsive-2xl font-bold">{formatter.format(balance)}</div>
            <p className="text-responsive-xs text-muted-foreground mt-1">Available to lend</p>
            <div className="mt-3 relative z-20"> 
              <AddCapitalDialog />
            </div>
          </div>
        </BentoCard>

        {/* 2. Receivables */}
        <BentoCard 
          className="col-span-1" 
          title="Receivables" 
          icon={<TrendingUp className="h-4 w-4"/>}
        >
          <div className="mt-2">
            <div className="text-responsive-2xl font-bold text-blue-500">
              {formatter.format(stats.totalReceivables)}
            </div>
            <p className="text-responsive-xs text-muted-foreground mt-1">Principal + Interest Due</p>
            <div className="mt-3 text-responsive-xs font-mono bg-blue-500/10 text-blue-600 px-2 py-1 rounded w-fit">
              Total Equity: {formatter.format(balance + stats.totalReceivables)}
            </div>
          </div>
        </BentoCard>

        {/* 3. Open Loans */}
        <BentoCard 
          className="col-span-1" 
          title="Active Borrowers" 
          icon={<Activity className="h-4 w-4"/>}
        >
          <div className="mt-2">
            <div className="text-responsive-2xl font-bold text-orange-500">{stats.activeCount}</div>
            <p className="text-responsive-xs text-muted-foreground mt-1">Open loans</p>
          </div>
        </BentoCard>

        {/* 4. Active Loans Table - Now a BentoCard itself */}
        <BentoCard 
          className="col-span-1 md:col-span-3 row-span-2" 
          tiltIntensity={1}
          magnetStrength={0.01}
          noPadding={true}
        >
          {loansTable}
        </BentoCard>
      </MagicBento>

      <div className="fixed bottom-8 left-8 z-50">
        <MotionToggleButton />
      </div>
    </div>
  );
}