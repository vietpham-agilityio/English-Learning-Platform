"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Components
import { FlowCelebrationParticles } from "@/src/components/common/Flow/FlowCelebrationParticles";
import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";

// Constants
import {
  FLOW_HERO_ITALIC_CLASS,
  FLOW_PRIMARY_LINK_CLASS,
  FLOW_SECONDARY_LINK_CLASS,
} from "@/src/constants/styles";
import { ROUTES } from "@/src/constants/route";

const CheckoutSuccess = ({ sessionId }: { sessionId?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 50);
    const t2 = setTimeout(() => setCheckDone(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <FlowPageShell>
      <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <p
            className={`text-xs tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-4 ${
              mounted ? "animate-flow-hero-in" : "opacity-0"
            }`}
          >
            Order Confirmed
          </p>
          <h1
            className={`text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            You&apos;re all
            <span className={FLOW_HERO_ITALIC_CLASS}>set to learn.</span>
          </h1>
          <p
            className={`text-stone-400 text-base max-w-sm leading-relaxed ${
              mounted ? "animate-flow-fade-up-2" : "opacity-0"
            }`}
          >
            Your payment was successful. Your balance will update shortly and
            your categories will be ready.
          </p>
          <div
            className={`flex flex-wrap gap-3 mt-8 ${
              mounted ? "animate-flow-fade-up-3" : "opacity-0"
            }`}
          >
            <span className="animate-flow-pill-1 inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full">
              ✓ Payment complete
            </span>
            <span className="animate-flow-pill-2 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              🌱 Ready to practice
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className={`bg-white border border-stone-200 rounded-2xl p-8 shadow-sm ${
            mounted ? "animate-flow-fade-up-4" : "opacity-0"
          }`}
        >
          <div className="relative w-14 h-14 mb-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
                <path
                  className={
                    checkDone
                      ? "flow-check-path flow-check-path-drawn"
                      : "flow-check-path"
                  }
                  d="M6 14l6 6 10-10"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {checkDone && <div className="flow-ring" />}
            {checkDone && <div className="flow-ring flow-ring-delayed" />}
            <FlowCelebrationParticles show={checkDone} />
          </div>

          <h2 className="text-xl font-black text-stone-900 tracking-tight mb-2">
            Payment received
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
            Thanks for your purchase — your balance will update within a few
            moments. You can return to categories anytime.
          </p>

          {sessionId && (
            <div className="mt-6 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl">
              <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-widest">
                Session ID
              </p>
              <p className="font-mono text-xs text-stone-500 break-all">
                {sessionId}
              </p>
            </div>
          )}

          <div
            className={`mt-8 flex flex-col sm:flex-row gap-3 ${
              mounted ? "animate-flow-fade-up-5" : "opacity-0"
            }`}
          >
            <Link href={ROUTES.COURSES} className={FLOW_PRIMARY_LINK_CLASS}>
              Browse courses →
            </Link>
            <Link href={ROUTES.HOME} className={FLOW_SECONDARY_LINK_CLASS}>
              Back to home
            </Link>
          </div>
        </div>

        <p className="text-xs text-stone-400 tracking-wide text-center mt-8">
          Questions? Contact us at support@englishflow.com 🌱
        </p>
      </div>
    </FlowPageShell>
  );
};

export default CheckoutSuccess;
