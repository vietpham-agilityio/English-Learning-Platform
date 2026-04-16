"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FlowCelebrationParticles } from "@/src/components/common/Flow/FlowCelebrationParticles";
import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";

import {
  FLOW_HERO_ITALIC_CLASS,
  FLOW_PRIMARY_LINK_CLASS,
  FLOW_SECONDARY_LINK_CLASS,
  FLOW_CANCEL_PARTICLES,
} from "@/src/constants/styles";
import { ROUTES } from "@/src/constants/route";

type Props = {
  readonly error: unknown;
  readonly onRetry: () => void;
};

const ErrorView = ({ error, onRetry }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [xDone, setXDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 50);
    const t2 = setTimeout(() => setXDone(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const message = useMemo(() => {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }
    return "Unexpected error";
  }, [error]);

  const xPathClass = xDone
  ? "flow-cancel-path flow-cancel-path-drawn"
  : "flow-cancel-path";

  return (
    <FlowPageShell>
      <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <p
            className={`text-xs tracking-[0.25em] uppercase text-red-400 font-semibold mb-4 ${
              mounted ? "animate-flow-hero-in" : "opacity-0"
            }`}
          >
            Something went wrong
          </p>
          <h1
            className={`text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            Please{" "}
            <span
              className={`${FLOW_HERO_ITALIC_CLASS} text-red-300`}
            >
              try again.
            </span>
          </h1>
          <p
            className={`text-stone-400 text-base max-w-sm leading-relaxed ${
              mounted ? "animate-flow-fade-up-2" : "opacity-0"
            }`}
          >
            We couldn&apos;t load this page. Your payment or progress is safe—try
            again in a moment.
          </p>

          <div
            className={`flex flex-wrap gap-3 mt-8 ${
              mounted ? "animate-flow-fade-up-3" : "opacity-0"
            }`}
          >
            <span className="animate-flow-pill-1 inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full">
              Retry suggested
            </span>
            <span className="animate-flow-pill-2 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              🌱 Keep learning
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
            <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
                <path
                  className={xPathClass}
                  d="M8 8l12 12"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className={xPathClass}
                  d="M20 8L8 20"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {xDone && <div className="flow-ring-cancel" />}
            {xDone && <div className="flow-ring-cancel flow-ring-cancel-delayed" />}
            <FlowCelebrationParticles show={xDone} particles={FLOW_CANCEL_PARTICLES} />
          </div>

          <h2 className="text-xl font-black text-stone-900 tracking-tight mb-2">
            Something went wrong
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
            {message}
          </p>

          <div
            className={`mt-8 flex flex-col sm:flex-row gap-3 ${
              mounted ? "animate-flow-fade-up-5" : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={onRetry}
              className={FLOW_PRIMARY_LINK_CLASS}
            >
              Try again →
            </button>
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

export default ErrorView;

