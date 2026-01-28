"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { lookupBorrowerData, LoanLookupResult } from "@/app/actions/loan-lookup";
import { useMotion } from "@/components/context/motion-context";
import MagicBento, { BentoCard } from "@/components/ui/magic-bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, Search, Activity, FileText, 
  History, ArrowLeft, CheckCircle2, AlertTriangle, Wallet,
  ChevronLeft, ChevronRight, QrCode
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip, Legend 
} from "recharts";
import { QRCodeCard } from "./qr-code-card";

// ... (calculateHealth function remains the same) ...
function calculateHealth(loans: LoanLookupResult['loans']) {
    if (!loans.length) return { score: 100, status: "No History", color: "text-muted-foreground", hex: "#94a3b8" };
  
    let score = 100;
    const activeLoans = loans.filter(l => l.status === "ACTIVE");
    const paidLoans = loans.filter(l => l.status === "PAID");
  
    if (activeLoans.length > 1) score -= (activeLoans.length - 1) * 10;
  
    activeLoans.forEach(loan => {
      const paidRatio = loan.total_paid / loan.total_due;
      if (paidRatio < 0.2) score -= 5;
    });
  
    score += (paidLoans.length * 5);
    score = Math.max(0, Math.min(100, score));
  
    let status = "Moderate";
    let color = "text-yellow-500";
    let hex = "#eab308";
  
    if (score >= 85) { status = "Excellent"; color = "text-emerald-500"; hex = "#10b981"; }
    else if (score >= 70) { status = "Good"; color = "text-green-500"; hex = "#22c55e"; }
    else if (score < 50) { status = "At Risk"; color = "text-destructive"; hex = "#ef4444"; }
  
    return { score, status, color, hex };
  }

export default function LoanTrackerClient() {
  const { reduceMotion } = useMotion();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<'INPUT' | 'RESULTS'>('INPUT');
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoanLookupResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const queryName = searchParams.get('q');
    if (queryName && !data && !isLoading && state === 'INPUT') {
      setFullName(queryName);
      performLookup(queryName);
    }
  }, [searchParams]);

  const performLookup = async (nameToSearch: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await lookupBorrowerData(nameToSearch);
      
      if (result.error) {
        setError(result.error);
      } else if (result.success && result.data) {
        setData(result.data);
        setCurrentPage(1);
        setState('RESULTS');
        router.replace(`/loan-tracking?q=${encodeURIComponent(nameToSearch)}`, { scroll: false });
      }
    } catch (err) {
      setError("Connection failed. Please check your internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(fullName);
  };

  const handleReset = () => {
    setFullName("");
    setData(null);
    setState('INPUT');
    setError(null);
    setCurrentPage(1);
    router.replace('/loan-tracking', { scroll: false });
  };

  if (state === 'INPUT') {
    // ... (Input state UI remains the same) ...
    return (
        <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-responsive">
          <div className="w-full max-w-[90rem] mx-auto">
            <MagicBento 
              disableAnimations={reduceMotion}
              enableSpotlight={true}
              spotlightRadius={300}
              enableStars={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-responsive"
            >
               <div className="hidden md:block col-span-1 row-span-1" />
               <div className="hidden md:block col-span-1 row-span-1" />
               <div className="hidden md:block col-span-1 row-span-1" />
               <div className="hidden md:block col-span-1 row-span-1" />
               <div className="hidden md:block col-span-1 row-span-1" />
  
               <BentoCard 
                 title="Loan Tracking" 
                 icon={<Search className="h-4 w-4" />}
                 className="col-span-1 md:col-span-2 md:row-span-2 md:col-start-2 md:row-start-2 flex flex-col min-h-[400px]"
                 noPadding={true}
               >
                 <div className="flex flex-col h-full justify-center px-6 py-6 overflow-y-auto relative">
                   <div className="text-center space-y-2 mb-6 shrink-0">
                     <h2 className="text-3xl font-serif font-bold tracking-tight">Borrower Portal</h2>
                     <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                       Enter your full name to instantly view your health score and active loan history.
                     </p>
                   </div>
  
                   <form onSubmit={handleSearch} className="space-y-3 w-full max-w-sm mx-auto shrink-0 pb-2">
                     <div className="space-y-1.5 text-left">
                       <Label htmlFor="fullname">Full Name</Label>
                       <Input 
                         id="fullname" 
                         placeholder="e.g. Maria Santos" 
                         value={fullName}
                         onChange={(e) => {
                           setFullName(e.target.value);
                           if (error) setError(null);
                         }}
                         className="h-10 bg-background/50 backdrop-blur-sm transition-all focus:bg-background"
                         required
                       />
                     </div>
  
                     {error && (
                        <div className="bg-destructive/10 text-destructive text-xs py-2 px-3 rounded-md border border-destructive/20 font-medium flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> 
                          <span className="leading-tight">{error}</span>
                        </div>
                     )}
  
                     <Button type="submit" className="w-full h-10 mt-1" disabled={isLoading}>
                       {isLoading ? (
                         <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
                       ) : (
                         "Retrieve Data"
                       )}
                     </Button>
                   </form>
                 </div>
               </BentoCard>
  
               <div className="hidden md:block col-span-1 row-span-1" />
            </MagicBento>
          </div>
        </div>
      );
  }

  if (!data) return null;

  const { borrower, loans, payments } = data;
  const health = calculateHealth(loans);
  const activeLoans = loans.filter(l => l.status === "ACTIVE");
  const paidLoans = loans.filter(l => l.status === "PAID");

  const totalDue = loans.reduce((acc, curr) => acc + curr.total_due, 0);
  const totalPaid = loans.reduce((acc, curr) => acc + curr.total_paid, 0);
  
  const chartData = [
    { name: 'Paid', value: totalPaid, color: '#10b981' },
    { name: 'Balance', value: totalDue - totalPaid, color: '#f59e0b' },
  ];

  const totalPages = Math.ceil(activeLoans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLoans = activeLoans.slice(startIndex, startIndex + itemsPerPage);
  const emptyRows = itemsPerPage - currentLoans.length; 

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  
  const qrData = typeof window !== "undefined" 
    ? `${window.location.origin}/loan-tracking?q=${encodeURIComponent(borrower.first_name + " " + borrower.last_name)}` 
    : "";

  return (
    <div className="min-h-screen w-full max-w-[90rem] mx-auto p-responsive pb-20 space-y-6 flex flex-col justify-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Welcome, {borrower.first_name}</h1>
          <p>Loan Portfolio & Health Summary</p>
        </div>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Search Again
        </Button>
      </div>

      {/* Results Grid */}
      <MagicBento 
        disableAnimations={reduceMotion}
        className="grid-cols-1 md:grid-cols-4 grid-rows-auto gap-responsive"
      >
        
        {/* 1. HEALTH SCORE (UPDATED SPACING) */}
        <BentoCard 
          title="Health Score" 
          icon={<Activity className="h-4 w-4" />}
          className="col-span-1 md:col-span-1 md:row-span-2"
        >
          {/* UPDATED: Changed py-8 to py-4, space-y-6 to space-y-3 */}
          <div className="flex flex-col items-center justify-center h-full py-4 space-y-3">
            
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                <circle 
                  cx="50%" cy="50%" r="56" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={351} 
                  strokeDashoffset={351 - (351 * health.score) / 100}
                  className={`${health.color} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                <span className={`text-4xl font-bold tracking-tighter leading-none ${health.color}`}>
                  {health.score}
                </span>
                <span className="text-[10px] uppercase font-medium text-muted-foreground/70 mt-1">
                  / 100
                </span>
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className={`text-2xl font-bold tracking-tight ${health.color}`}>
                {health.status}
              </div>
              <p className="text-xs text-muted-foreground px-4 leading-relaxed">
                Calculated based on repayment history.
              </p>
            </div>
          </div>
        </BentoCard>

        {/* 2. ACTIVE LOANS LIST (Existing) */}
        <BentoCard 
          title={`Active Loans (${activeLoans.length})`} 
          icon={<FileText className="h-4 w-4" />}
          className="col-span-1 md:col-span-3 md:row-span-2 min-h-[450px]"
          noPadding={true}
        >
          {/* ... Table logic ... */}
          <div className="flex flex-col h-full w-full">
            <div className="flex-1 p-6 space-y-3">
              {activeLoans.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full border border-dashed rounded-lg bg-muted/10 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
                  <p>No active loans. You are debt-free!</p>
                </div>
              ) : (
                <>
                  {currentLoans.map(loan => (
                    <div key={loan.id} className="h-[88px] flex flex-col md:flex-row justify-between items-center p-4 rounded-lg bg-background/40 border border-border/50">
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">
                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(loan.remaining_balance)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Remaining Balance
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 text-right">
                        <div>
                          <div className="text-xs text-muted-foreground">Original Principal</div>
                          <div className="font-medium">
                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(loan.principal)}
                          </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-xs text-muted-foreground">Start Date</div>
                            <div className="font-medium">{new Date(loan.start_date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, i) => (
                     <div key={`ghost-${i}`} className="h-[88px] w-full border border-transparent" aria-hidden="true" />
                  ))}
                </>
              )}
            </div>

            {activeLoans.length > 0 && (
              <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/5 mt-auto h-[72px] shrink-0">
                <span className="text-xs text-muted-foreground">
                   Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, activeLoans.length)} of {activeLoans.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium border border-border/60 rounded-md hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" /> Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-medium border border-border/60 rounded-md hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    Next <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </BentoCard>

        {/* 3. PAYMENT STATUS (UPDATED SPACING) */}
        <BentoCard 
          title="Payment Status" 
          icon={<AlertTriangle className="h-4 w-4" />}
          className="col-span-1 md:col-span-2 min-h-[250px]"
        >
          {/* UPDATED: Using flex column to distribute space, pushed chart down slightly but filled height */}
          <div className="flex flex-col h-full justify-center">
             <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={chartData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                   />
                   <Legend verticalAlign="middle" align="right" layout="vertical" />
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </div>
        </BentoCard>

        {/* 4. HISTORY (UPDATED SPACING) */}
        <BentoCard 
          title="History" 
          icon={<History className="h-4 w-4" />}
          className="col-span-1 md:col-span-1 min-h-[250px]"
        >
          {/* UPDATED: Added h-full, justify-center, and reduced space-y from 6 to 4 */}
          <div className="flex flex-col justify-center h-full space-y-4 px-2 pb-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Loans</span>
              <span className="text-2xl font-bold">{loans.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fully Paid</span>
              <span className="text-2xl font-bold text-emerald-500">{paidLoans.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Payments</span>
              <span className="text-2xl font-bold text-blue-500">{payments.length}</span>
            </div>
          </div>
        </BentoCard>

        {/* 5. QR CODE */}
        <BentoCard 
          title="Share / Save" 
          icon={<QrCode className="h-4 w-4" />}
          className="col-span-1 md:col-span-1 min-h-[250px]"
        >
           <QRCodeCard data={qrData} healthHex={health.hex} />
        </BentoCard>

      </MagicBento>
    </div>
  );
}