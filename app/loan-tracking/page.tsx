import { Suspense } from "react";
import MotionToggleWrapper from "@/components/wrappers/motion-toggle-wrapper";
import LoanTrackerClient from "@/components/loan-tracking/loan-tracker-client";
import { Loader2 } from "lucide-react";

export default function LoanTrackingPage() {
  return (
    <MotionToggleWrapper>
       <div className="w-full min-h-screen relative overflow-y-auto overflow-x-hidden pt-8">
          <Suspense fallback={
            <div className="flex h-[80vh] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }>
            <LoanTrackerClient />
          </Suspense>
       </div>
    </MotionToggleWrapper>
  );
}