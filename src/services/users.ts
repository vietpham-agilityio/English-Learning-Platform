import { cache } from 'react';

import { API_BASE } from '../constants/endpoint';
import { API_VERSION } from '../constants/endpoint';
import { ROUTES } from '../constants/route';
import type { UserProfile } from '../types';

export const getUsers = cache(async (token: string | null): Promise<UserProfile[]> => {
  const res = await fetch(`${API_BASE}/${API_VERSION}${ROUTES.USERS}`, {
    cache: 'no-store',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
});

/** Deduped per server render when layout + page both need the same profile. */
export const getUserProfile = cache(
  async (token: string | null): Promise<UserProfile> => {
    const res = await fetch(`${API_BASE}/${API_VERSION}${ROUTES.ME}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
);

export const getUserById = cache(
  async (token: string | null, id: string): Promise<UserProfile> => {
    const res = await fetch(`${API_BASE}/${API_VERSION}${ROUTES.USERS}/${id}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
);

/** `POST /users/:id/promote` — elevates a user to admin (admin-only). */
export const promoteUser = async (
  token: string | null,
  id: string,
): Promise<UserProfile> => {
  const res = await fetch(
    `${API_BASE}/${API_VERSION}${ROUTES.USERS}/${id}/promote`,
    {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
