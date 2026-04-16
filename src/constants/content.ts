export const COURSE_META: Record<string, { icon: string; desc: string }> = {
  Vocabulary: { icon: '🌱', desc: 'Grow your word garden' },
  Grammar: { icon: '🍃', desc: 'Shape your sentences' },
  Listening: { icon: '🌊', desc: 'Tune into the flow' },
  Speaking: { icon: '🌬️', desc: 'Let your voice carry' },
  Reading: { icon: '🌿', desc: 'Wander through words' },
  Writing: { icon: '🪵', desc: 'Craft with intention' },
  Technology: { icon: '⚙️', desc: 'Tech vocabulary & terms' },
  Business: { icon: '🌾', desc: 'Professional English' },
  Art: { icon: '🎨', desc: 'Creative expression' },
  Programming: { icon: '🖥️', desc: 'Code & logic language' },
  Design: { icon: '✏️', desc: 'Visual communication' },
};

export const FALLBACK_COURSE_META = {
  icon: '🌱',
  desc: 'Explore and discover',
};

const COURSE_ICON_POOL: readonly string[] = [
  ...new Set(Object.values(COURSE_META).map((m) => m.icon)),
];

/**
 * Icon for admin course rows: known title → COURSE_META; otherwise deterministic by `courseId`.
 */
export function courseRowIcon(courseTitle: string, courseId: string): string {
  const meta = COURSE_META[courseTitle];
  if (meta) return meta.icon;
  let h = 0;
  for (let i = 0; i < courseId.length; i += 1) {
    h = Math.imul(31, h) + courseId.charCodeAt(i);
  }
  const idx = Math.abs(h) % COURSE_ICON_POOL.length;
  return COURSE_ICON_POOL[idx] ?? FALLBACK_COURSE_META.icon;
}

/** Role badge copy for the users directory (mirrors COURSE_META pattern). */
export const USER_ROLE_META: Record<string, { icon: string; desc: string }> = {
  USER: { icon: '👤', desc: 'Learner account' },
  ADMIN: { icon: '⚙️', desc: 'Platform administrator' },
};

export const FALLBACK_USER_ROLE_META = {
  icon: '🌱',
  desc: 'Community member',
};
