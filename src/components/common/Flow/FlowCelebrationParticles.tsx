"use client";

import { Fragment, type CSSProperties, type ReactElement } from "react";

import {
  FLOW_CELEBRATION_PARTICLES,
  type FlowParticle,
} from "../../../constants/styles";

type Props = {
  readonly show: boolean;
  readonly particles?: readonly FlowParticle[];
};

/**
 * Decorative particle burst used on checkout success, cancel, and 404 pages.
 */
export function FlowCelebrationParticles({
  show,
  particles = FLOW_CELEBRATION_PARTICLES,
}: Props): ReactElement | null {
  if (!show) {
    return null;
  }

  return (
    <Fragment>
      {particles.map((p, i) => (
        <div
          key={i}
          className="flow-particle"
          style={
            {
              background: p.color,
              "--tx": p.tx,
              animationDelay: p.delay,
            } as CSSProperties
          }
        />
      ))}
    </Fragment>
  );
}
