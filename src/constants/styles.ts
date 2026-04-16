export type FlowParticle = {
  readonly color: string;
  readonly tx: string;
  readonly delay: string;
};

/**
 * Burst used on checkout success and 404 (emerald palette).
 */
export const FLOW_CELEBRATION_PARTICLES: readonly FlowParticle[] = [
  { color: '#059669', tx: 'translate(-26px,-26px)', delay: '0s' },
  { color: '#34d399', tx: 'translate(26px,-26px)', delay: '0.06s' },
  { color: '#d97706', tx: 'translate(26px, 26px)', delay: '0.12s' },
  { color: '#0284c7', tx: 'translate(-26px,26px)', delay: '0.09s' },
  { color: '#059669', tx: 'translate(0,-32px)', delay: '0.03s' },
  { color: '#34d399', tx: 'translate(32px,0)', delay: '0.15s' },
];

/**
 * Smaller burst for checkout cancel (red palette).
 */
export const FLOW_CANCEL_PARTICLES: readonly FlowParticle[] = [
  { color: '#ef4444', tx: 'translate(-26px,-26px)', delay: '0s' },
  { color: '#f87171', tx: 'translate(26px,-26px)', delay: '0.04s' },
  { color: '#ef4444', tx: 'translate(26px,26px)', delay: '0.08s' },
  { color: '#f87171', tx: 'translate(-26px,26px)', delay: '0.06s' },
];

/**
 * List row card — shared by {@link UserRow}, course admin rows, etc.
 * Hover lift + emerald border matches directory UX.
 */
export const FLOW_LIST_ROW_CLASS =
  'group w-full text-left bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-md rounded-2xl px-6 py-5 transition-all duration-200 hover:-translate-y-0.5';

/** Shared CTA styles for flow pages (success, cancel, 404). */
export const FLOW_PRIMARY_LINK_CLASS =
  'flow-shimmer-btn inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-transform duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-900/20';

export const FLOW_SECONDARY_LINK_CLASS =
  'inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 text-stone-700 text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200';

/** Italic accent line under the main hero title. */
export const FLOW_HERO_ITALIC_CLASS =
  'block italic text-emerald-400 font-normal font-serif';
