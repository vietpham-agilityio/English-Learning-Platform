"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { getUserById, promoteUser } from "@/src/services/users";
import { USER_ROLE_META, FALLBACK_USER_ROLE_META } from "@/src/constants/content";
import { USER_ROLE } from "@/src/constants/enum";
import type { UserProfile } from "@/src/types";

import { PromoteUserModal } from "@/src/ui/UsersPage/PromoteUserModal";

type Props = {
  readonly user: UserProfile;
  readonly index: number;
  /** True when the signed-in viewer is an admin; shows the Promote button. */
  readonly isAdmin?: boolean;
};

function displayName(u: UserProfile): string {
  const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return full || u.email;
}

export function UserRow({ user, index, isAdmin = false }: Props) {
  const { isLoaded, getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimistic role — updated locally after a successful promote so the badge
  // and button visibility reflect the change without a full page reload.
  const [localRole, setLocalRole] = useState<USER_ROLE>(user.role);

  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [promoteError, setPromoteError] = useState<string | null>(null);

  // createPortal requires the browser DOM — guard against SSR.
  const [domReady, setDomReady] = useState(false);
  useEffect(() => { setDomReady(true); }, []);

  const meta = USER_ROLE_META[localRole] ?? FALLBACK_USER_ROLE_META;

  const loadDetail = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const token = await getToken();
      const data = await getUserById(token, user.id);
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load user detail");
    } finally {
      setLoading(false);
    }
  }, [getToken, user.id]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && detail === null && !loading) {
      void loadDetail();
    }
  };

  const handlePromoteConfirm = async () => {
    setPromoteError(null);
    setPromoting(true);
    try {
      const token = await getToken();
      await promoteUser(token, user.id);
      setLocalRole(USER_ROLE.ADMIN);
      setDetail((prev) =>
        prev ? { ...prev, role: USER_ROLE.ADMIN } : prev,
      );
      setShowPromoteModal(false);
    } catch (e) {
      setPromoteError(
        e instanceof Error ? e.message : "Could not promote user",
      );
    } finally {
      setPromoting(false);
    }
  };

  const rowClass =
    "group w-full text-left bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-md rounded-2xl px-6 py-5 transition-all duration-200 hover:-translate-y-0.5";

  const summary = (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-5">
        <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="shrink-0 text-2xl">{meta.icon}</span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-stone-900 transition-colors group-hover:text-emerald-700">
            {displayName(user)}
          </p>
          <p className="mt-0.5 truncate text-sm text-stone-400">{user.email}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
          {localRole}
        </span>
        <span
          className={`text-lg text-stone-300 transition-transform duration-200 group-hover:text-emerald-500 ${open ? "rotate-90" : ""
            }`}
          aria-hidden
        >
          →
        </span>
      </div>
    </div>
  );

  if (!isLoaded) {
    return (
      <div className={`${rowClass} cursor-wait opacity-80`}>
        {summary}
      </div>
    );
  }

  const canPromote = isAdmin && localRole !== USER_ROLE.ADMIN;

  return (
    <>
      {domReady && createPortal(
        <PromoteUserModal
          open={showPromoteModal}
          userName={displayName(user)}
          onClose={() => {
            setShowPromoteModal(false);
            setPromoteError(null);
          }}
          onConfirm={() => void handlePromoteConfirm()}
          promoting={promoting}
          error={promoteError}
        />,
        document.body,
      )}

      <div className="space-y-0">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className={`${rowClass} relative`}
        >
          {summary}
          {loading && open && (
            <div className="absolute inset-0 z-10 rounded-2xl bg-white/50 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-emerald-600" />
            </div>
          )}
        </button>

        {open && (
          <div className={`mt-2 rounded-2xl border border-stone-200 bg-stone-50/80 text-sm text-stone-700 ${!error ? "px-3 py-2" : "p-0"}`}>
            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            {detail && !error && (
              <>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                      User ID
                    </dt>
                    <dd className="mt-0.5 font-mono text-xs break-all text-stone-800">
                      {detail.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                      Role
                    </dt>
                    <dd className="mt-0.5 font-medium text-stone-900 uppercase">{localRole}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                      Email
                    </dt>
                    <dd className="mt-0.5">{detail.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                      First name
                    </dt>
                    <dd className="mt-0.5">{detail.firstName || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                      Last name
                    </dt>
                    <dd className="mt-0.5">{detail.lastName || "—"}</dd>
                  </div>
                </dl>

                {canPromote && (
                  <div className="mt-4 flex justify-end border-t border-stone-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowPromoteModal(true)}
                      className="flow-shimmer-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-transform duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Promote to Admin
                    </button>
                  </div>
                )}
              </>
            )}
            {loading && !detail && !error && (
              <p className="text-stone-500 text-xs flex items-center gap-2">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-stone-300 border-t-emerald-600" />
                Loading profile from API…
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
