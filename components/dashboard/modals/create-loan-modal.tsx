"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScanText } from "lucide-react";
import { ManualLoanForm } from "./manual-loan-form";
import { ScanLoanForm } from "./scan-loan-form";

export function CreateLoanModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'manual' | 'scan'>('manual');

  // Reset state when modal opens/closes
  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setMode('manual');
    }
  }

  function handleSuccess() {
    setOpen(false);
    setMode('manual');
  }

  function switchToScanMode() {
    setMode('scan');
  }

  function switchToManualMode() {
    setMode('manual');
  }

  function handleCancel() {
    setOpen(false);
    setMode('manual');
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <ScanText className="h-4 w-4" />
          New Loan
        </Button>
      </DialogTrigger>
      
      {/* 
        ═══════════════════════════════════════════════════════════════
        🎯 MODAL WIDTH CONTROL
        ═══════════════════════════════════════════════════════════════
        Change "max-w-xl" to adjust modal width:
        - max-w-sm (384px)  - Very compact
        - max-w-md (448px)  - Small
        - max-w-lg (512px)  - Medium
        - max-w-xl (576px)  - Current size
        - max-w-2xl (672px) - Large
        - Or use exact pixels: className="w-[500px] max-h-[90vh]..."
      */}
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'manual' ? "Create New Loan" : 
             "Scan Loan Card"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {mode === 'manual' ? (
            <ManualLoanForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              onSwitchToScan={switchToScanMode}
            />
          ) : (
            <ScanLoanForm
              onSuccess={handleSuccess}
              onSwitchToManual={switchToManualMode}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}