"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeCardProps {
  data: string;
  logoUrl?: string; // Optional: Add your app logo URL here
}

export function QRCodeCard({ data, logoUrl }: QRCodeCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    // Initialize QR Code Styling
    qrCode.current = new QRCodeStyling({
      width: 200,
      height: 200,
      type: "svg",
      data: data,
      image: logoUrl,
      dotsOptions: {
        color: "#ffffff", // White dots for dark mode contrast
        type: "rounded",
      },
      backgroundOptions: {
        color: "transparent",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,
      },
      cornersSquareOptions: {
        color: "#ffffff",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#ffffff",
      }
    });

    if (ref.current) {
      ref.current.innerHTML = "";
      qrCode.current.append(ref.current);
    }
  }, [data, logoUrl]);

  const handleDownload = () => {
    qrCode.current?.download({
      name: "loan-portfolio-qr",
      extension: "png",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div 
        ref={ref} 
        className="bg-black/20 p-4 rounded-xl border border-white/10 shadow-inner"
      />
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Scan to view or download<br/>this summary on mobile
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs gap-2"
          onClick={handleDownload}
        >
          <Download className="h-3 w-3" /> Save QR
        </Button>
      </div>
    </div>
  );
}