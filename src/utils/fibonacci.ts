import { type TreeItem, EstimateValueToHours } from "../types";
import { getChildren } from "../types";

export function isEstimateHigh(estimate: string): boolean {
  const hours =
    EstimateValueToHours[estimate as keyof typeof EstimateValueToHours] || 0;
  return hours >= 8;
}
