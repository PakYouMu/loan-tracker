"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavOverlay from "@/components/landing-page/nav-overlay";

export function GlobalNav({ authButton }: { authButton: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Define links for different areas
  const landingLinks = (
    <div className="flex flex-col gap-1">
      <div className="nav-section-title">Menu</div>
      <Link href="/" className="nav-link-item">Home</Link>
      <Link href="/#about" className="nav-link-item">About Us</Link>
      <Link href="/#features" className="nav-link-item">Features</Link>
    </div>
  );

  const dashboardLinks = (
    <div className="flex flex-col gap-1">
      <div className="nav-section-title">Dashboard</div>
      <Link href="/dashboard" className="nav-link-item">Overview</Link>
      <Link href="/dashboard/loans" className="nav-link-item">Loans</Link>
      <Link href="/dashboard/borrowers" className="nav-link-item">Borrowers</Link>
    </div>
  );

  return (
    <NavOverlay navItems={isDashboard ? dashboardLinks : landingLinks}>
      {authButton}
    </NavOverlay>
  );
}