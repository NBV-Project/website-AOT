import React, { Suspense } from "react";
import { SuperAdminLayoutClient } from "@/components/superadmin-layout-client";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SuperAdminLayoutClient>{children}</SuperAdminLayoutClient>
    </Suspense>
  );
}
