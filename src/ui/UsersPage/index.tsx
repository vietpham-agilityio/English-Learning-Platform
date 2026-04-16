"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";

import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";
import { FLOW_HERO_ITALIC_CLASS } from "@/src/constants/styles";
import { USER_ROLE_META, FALLBACK_USER_ROLE_META } from "@/src/constants/content";
import { USER_ROLE } from "@/src/constants/enum";
import type { UserProfile } from "@/src/types";

import { UserRow } from "@/src/ui/UsersPage/UserRow";

export type UsersPageViewProps = {
  readonly users: readonly UserProfile[];
  /** Current session profile from `GET /users/me` (null if unavailable). */
  readonly me: UserProfile | null;
  /** Set when the users list request failed. */
  readonly listError: string | null;
};

function displayName(u: UserProfile): string {
  const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return full || u.email;
}

function ProfileHighlightCard({ user }: { readonly user: UserProfile }): ReactElement {
  const meta = USER_ROLE_META[user.role] ?? FALLBACK_USER_ROLE_META;

  return (
    <div className="mb-10 rounded-2xl border border-emerald-200/60 bg-linear-to-br from-emerald-50 to-white px-6 py-6 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-3">
        Your profile
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{meta.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{displayName(user)}</h2>
            <p className="mt-0.5 text-sm text-stone-500">{user.email}</p>
            <p className="mt-1 text-xs text-stone-400">{meta.desc}</p>
          </div>
        </div>
        <dl className="grid shrink-0 gap-2 text-sm sm:text-right">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
              Role
            </dt>
            <dd className="font-semibold text-emerald-800">{user.role}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
              User ID
            </dt>
            <dd className="font-mono text-xs break-all text-stone-700 max-w-[16rem] sm:ml-auto">
              {user.id}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function UsersPageView({
  users,
  me,
  listError,
}: UsersPageViewProps): ReactElement {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const total = users.length;
  /** Avoid duplicating the signed-in user in the list when the highlight card is shown. */
  const listUsers = me
    ? users.filter((u) => u.id !== me.id)
    : [...users];

  return (
    <FlowPageShell>
      <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <p
            className={`text-xs tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-4 ${
              mounted ? "animate-flow-hero-in" : "opacity-0"
            }`}
          >
            Directory
          </p>
          <h1
            className={`text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            People on the
            <span className={FLOW_HERO_ITALIC_CLASS}> platform</span>
          </h1>
          <p
            className={`text-stone-400 text-base max-w-sm leading-relaxed ${
              mounted ? "animate-flow-fade-up-2" : "opacity-0"
            }`}
          >
            Browse learners synced from Clerk. Expand a row to load full profile
            detail from the API.
          </p>

          <div
            className={`flex flex-wrap gap-3 mt-8 ${
              mounted ? "animate-flow-fade-up-3" : "opacity-0"
            }`}
          >
            <span className="animate-flow-pill-1 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              {total} {total === 1 ? "user" : "users"}
            </span>
            <span className="animate-flow-pill-2 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              🔐 Clerk-backed
            </span>
            <span className="animate-flow-pill-3 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              ✦ Synced profiles
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {me && (
          <div className={mounted ? "animate-flow-fade-up-4" : "opacity-0"}>
            <ProfileHighlightCard user={me} />
          </div>
        )}

        {listError && (
          <div
            className={`mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 ${
              mounted ? "animate-flow-fade-up-4" : "opacity-0"
            }`}
            role="alert"
          >
            <p className="font-semibold">Could not load the full directory</p>
            <p className="mt-1 text-amber-700/90">{listError}</p>
          </div>
        )}

        {!listError && total === 0 && (
          <div
            className={`text-center py-24 text-stone-400 ${
              mounted ? "animate-flow-fade-up-4" : "opacity-0"
            }`}
          >
            <span className="text-5xl block mb-4">👥</span>
            <p className="text-lg font-semibold text-stone-600">No users yet.</p>
            <p className="text-sm mt-1">
              Sign up or sync a Clerk webhook — the list will fill in here.
            </p>
          </div>
        )}

        {!listError && me && listUsers.length === 0 && total > 0 && (
          <p
            className={`text-center text-sm text-stone-500 py-6 ${
              mounted ? "animate-flow-fade-up-4" : "opacity-0"
            }`}
          >
            You&apos;re the only profile in the directory right now.
          </p>
        )}

        {!listError && listUsers.length > 0 ? (
          <ul className="space-y-3">
            {listUsers.map((user, index) => (
              <li
                key={user.id}
                className={mounted ? "flow-row-in" : "opacity-0"}
                style={
                  mounted
                    ? ({ animationDelay: `${0.08 * index}s` } as CSSProperties)
                    : undefined
                }
              >
                <UserRow
                  user={user}
                  index={index}
                  isAdmin={me?.role === USER_ROLE.ADMIN}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <p
          className={`text-xs text-stone-400 tracking-wide text-center ${
            mounted ? "animate-flow-fade-up-5" : "opacity-0"
          }`}
        >
          {listError
            ? "Fix the API connection and refresh the page."
            : `${total} ${total === 1 ? "user" : "users"} in the directory · Expand for full detail`}
        </p>
      </div>
    </FlowPageShell>
  );
}
