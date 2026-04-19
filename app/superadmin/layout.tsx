import React from "react";
import { SuperAdminLayoutClient } from "@/components/superadmin-layout-client";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayoutClient>{children}</SuperAdminLayoutClient>;
}
