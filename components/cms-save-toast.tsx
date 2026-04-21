"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { AdminPortal } from "@/components/admin-portal";

export type CmsSaveStatus = "idle" | "saving" | "success" | "error";

type CmsSaveToastProps = {
  status: CmsSaveStatus;
  onClear: () => void;
  messages: {
    saving: string;
    success: string;
    error: string;
  };
};

type CmsSaveToastLabels = Record<"th" | "en" | "zh", Record<Exclude<CmsSaveStatus, "idle">, string>>;

const TOAST_EXIT_MS = 360;
const TOAST_VISIBLE_MS = 3000;

export function CmsSaveToast({ status, onClear, messages }: CmsSaveToastProps) {
  const [renderStatus, setRenderStatus] = useState<CmsSaveStatus>("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [adminLang, setAdminLang] = useState<keyof CmsSaveToastLabels>(() => {
    if (typeof window === "undefined") {
      return "th";
    }

    const storedLang = localStorage.getItem("admin_lang");

    return storedLang === "en" || storedLang === "zh" ? storedLang : "th";
  });

  useEffect(() => {
    const getLang = () => {
      const storedLang = localStorage.getItem("admin_lang");

      return storedLang === "en" || storedLang === "zh" ? storedLang : "th";
    };

    const handleLangChange = () => setAdminLang(getLang());

    window.addEventListener("admin_lang_changed", handleLangChange);
    return () => window.removeEventListener("admin_lang_changed", handleLangChange);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      if (renderStatus === "idle") {
        return;
      }

      const hideFrame = window.requestAnimationFrame(() => {
        setIsVisible(false);
      });

      const exitTimer = window.setTimeout(() => {
        setRenderStatus("idle");
      }, TOAST_EXIT_MS);

      return () => {
        window.cancelAnimationFrame(hideFrame);
        window.clearTimeout(exitTimer);
      };
    }

    const showFrame = window.requestAnimationFrame(() => {
      setRenderStatus(status);
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(showFrame);
  }, [renderStatus, status]);

  useEffect(() => {
    if (status !== "success" && status !== "error") {
      return;
    }

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, TOAST_VISIBLE_MS);

    const clearTimer = window.setTimeout(() => {
      onClear();
    }, TOAST_VISIBLE_MS + TOAST_EXIT_MS);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearTimer);
    };
  }, [onClear, status]);

  if (renderStatus === "idle") {
    return null;
  }

  const labelsByLocale: CmsSaveToastLabels = {
    th: { saving: "กำลังบันทึก", success: "บันทึกแล้ว", error: "ข้อผิดพลาด" },
    en: { saving: "Saving", success: "Saved", error: "Error" },
    zh: { saving: "保存中", success: "已保存", error: "错误" },
  };

  const labels = labelsByLocale[adminLang as keyof CmsSaveToastLabels] || labelsByLocale.th;

  const toneByStatus = {
    saving: {
      container: "border-[#002548]/10 bg-white text-[#002548]",
      iconWrap: "bg-[#002548]/8 text-[#002548]",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      label: labels.saving,
      message: messages.saving,
    },
    success: {
      container: "border-emerald-200 bg-white text-emerald-700",
      iconWrap: "bg-emerald-50 text-emerald-600",
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: labels.success,
      message: messages.success,
    },
    error: {
      container: "border-red-200 bg-white text-red-700",
      iconWrap: "bg-red-50 text-red-500",
      icon: <AlertTriangle className="h-4 w-4" />,
      label: labels.error,
      message: messages.error,
    },
  } as const;

  const tone = toneByStatus[renderStatus];

  return (
    <AdminPortal>
      <div className="pointer-events-none fixed right-4 top-32 z-[9999] w-fit max-w-[280px] md:right-10">
        <div
          className={`pointer-events-auto overflow-hidden rounded-xl border shadow-[0_12px_30px_rgba(0,37,72,0.1)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            tone.container
          } ${
            isVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 py-2.5 pl-3 pr-2">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone.iconWrap}`}>
              {tone.icon}
            </span>
            <div className="min-w-[120px] flex-1">
              <p className="text-[8px] font-black uppercase tracking-[0.15em] opacity-40 leading-none">
                {tone.label}
              </p>
              <p className="mt-1 text-[11px] font-bold tracking-tight leading-none text-current">{tone.message}</p>
            </div>
            <button 
              onClick={onClear}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-300 hover:text-slate-600"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </AdminPortal>
  );
}
