"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Maitree } from "next/font/google";
import { Shield, ArrowLeft } from "lucide-react";

const kanit = Maitree({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap",
});

export default function LoginPage() {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const ref5 = useRef<HTMLInputElement>(null);
  const ref6 = useRef<HTMLInputElement>(null);

  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4, ref5, ref6], []);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("aot_admin_session");
    if (session === "active") {
      router.replace("/superadmin");
    }

    const timer = setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, [router, inputRefs]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value)) && value !== "") return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(false);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      void handleSubmit(newPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = useCallback(async (finalPin?: string[]) => {
    const enteredPin = (finalPin || pin).join("");
    if (enteredPin.length < 6) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin }),
      });
      const { success } = await res.json();
      if (success) {
        localStorage.setItem("aot_admin_session", "active");
        router.replace("/superadmin");
      } else {
        setLoading(false);
        setError(true);
        setPin(["", "", "", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    } catch {
      setLoading(false);
      setError(true);
      setPin(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    }
  }, [pin, router, inputRefs]);

  return (
    <div className={`${kanit.variable} ${kanit.className} font-kanit admin-theme min-h-screen bg-[#002548] flex items-center justify-center p-6 antialiased overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none text-[16px]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 shadow-xl transition-all duration-500 ${error ? "bg-red-500 scale-95" : "bg-[#D4AF37] -rotate-3 hover:rotate-0"}`}>
              <Shield className={`w-9 h-9 text-white ${loading ? "animate-pulse" : ""}`} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Access</h1>
            <p className="text-white/40 font-medium text-[10px] mt-3 uppercase tracking-[0.4em]">Enter 6-Digit Security Code</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full space-y-12">
            <div className={`flex justify-center gap-2 md:gap-3 ${error ? "animate-shake" : ""}`}>
              {pin.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={inputRefs[index]}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-16 md:w-14 md:h-20 bg-white/5 border-2 text-center text-3xl font-bold text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 ${
                      error ? "border-red-400/50" : digit ? "border-[#D4AF37] bg-white/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "border-white/10"
                    }`}
                  />
                  {digit && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></div>}
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <button
                type="submit"
                disabled={loading || pin.some(d => d === "")}
                className={`w-full py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-xl relative overflow-hidden ${
                  loading ? "bg-white/10 text-white/40 cursor-wait" : "bg-white text-[#002548] hover:bg-[#D4AF37] hover:shadow-[#D4AF37]/30 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#002548]/10 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Authorize Access"
                )}
              </button>
              
              <div className="flex justify-between items-center px-2">
                <button 
                  type="button" 
                  onClick={() => router.push("/")} 
                  className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Site
                </button>
                {error && <p className="text-red-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Invalid Code</p>}
              </div>
            </div>
          </form>
        </div>

        <div className="mt-10 text-center border-t border-white/5 pt-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">
            Asian Overseas Trading &copy; 2024
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
