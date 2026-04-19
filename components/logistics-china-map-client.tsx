"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { LogisticsChinaMap as LogisticsChinaMapType } from "./logistics-china-map";

const LogisticsChinaMapLazy = dynamic(
  () => import("@/components/logistics-china-map").then((m) => m.LogisticsChinaMap),
  { ssr: false },
);

export function LogisticsChinaMapClient(
  props: ComponentProps<typeof LogisticsChinaMapType>,
) {
  return <LogisticsChinaMapLazy {...props} />;
}
