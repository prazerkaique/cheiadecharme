import type { Prize } from "@cheia/types";

/**
 * Selects a prize based on weighted random probability.
 */
export function selectWeightedPrize(prizes: Prize[]): Prize {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;

  for (const prize of prizes) {
    random -= prize.weight;
    if (random <= 0) return prize;
  }

  return prizes[prizes.length - 1];
}

/**
 * Calculates the final rotation angle to land on a specific prize segment.
 * Adds 3-5 full rotations + the segment offset so the pointer (at top) lands
 * in the middle of the correct segment.
 */
export function calculateFinalAngle(prizeIndex: number, totalSegments: number): number {
  const segmentAngle = 360 / totalSegments;
  // The wheel is drawn starting from the top (12 o'clock), going clockwise.
  // The pointer is at the top. To land on segment i, we need to rotate so that
  // the middle of segment i is at the top.
  const segmentMiddle = segmentAngle * prizeIndex + segmentAngle / 2;
  // We rotate clockwise, so the target is 360 - segmentMiddle
  const targetAngle = 360 - segmentMiddle;
  // Add 3-5 full rotations for dramatic effect
  const fullRotations = (3 + Math.floor(Math.random() * 3)) * 360;
  return fullRotations + targetAngle;
}

/**
 * Easing function: exponential ease-out for natural deceleration.
 * t goes from 0 to 1, output goes from 0 to 1.
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
