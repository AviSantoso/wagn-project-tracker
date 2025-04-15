export type EstimateValue =
  | "1h"
  | "2h"
  | "3h"
  | "5h"
  | "1d"
  | "2d"
  | "3d"
  | "1w"
  | "";

export const EstimateValueToHours: Record<EstimateValue, number> = {
  "1h": 1,
  "2h": 2,
  "3h": 3,
  "5h": 5,
  "1d": 8,
  "2d": 16,
  "3d": 24,
  "1w": 40,
  "": 80,
};

export const EstimateValues = Object.keys(
  EstimateValueToHours
) as EstimateValue[];

export interface BaseItem {
  id: string;
  name: string;
  parentId: string | null;
}

export type CertaintyLevel = "low" | "medium" | "high";

export interface Leaf extends BaseItem {
  type: "leaf";
  estimate: EstimateValue;
  completed: boolean;
}

export interface Branch extends BaseItem {
  type: "branch";
  childOrder: string[];
  certainty?: CertaintyLevel; // Optional for backward compatibility
}

export type TreeItem = Leaf | Branch;

export interface FlatTreeData {
  items: Record<string, TreeItem>;
  rootId: string;
}

// Multipliers for different certainty levels
export const CertaintyMultipliers: Record<
  CertaintyLevel,
  { best: number; expected: number; worst: number }
> = {
  high: { best: 1, expected: 1.5, worst: 2.5 },
  medium: { best: 0.75, expected: 1, worst: 2 },
  low: { best: 0.5, expected: 1, worst: 1.25 },
};

// Helper functions for tree operations
export function buildTree(
  items: Record<string, TreeItem>,
  parentId: string | null
): TreeItem[] {
  return Object.values(items)
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getChildren(
  items: Record<string, TreeItem>,
  parentId: string
): TreeItem[] {
  const parent = items[parentId];
  if (!parent || parent.type !== "branch") return [];

  // Use childOrder if available, otherwise fallback to filtering and sorting by name
  if (parent.childOrder) {
    return parent.childOrder
      .map((id) => items[id])
      .filter((item): item is TreeItem => item !== undefined);
  }

  return Object.values(items)
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function calculateTotalEstimate(
  items: Record<string, TreeItem>,
  parentId: string
): number {
  const children = getChildren(items, parentId);
  return children.reduce((sum, child) => {
    if (child.type === "leaf") {
      return sum + EstimateValueToHours[child.estimate];
    } else {
      return sum + calculateTotalEstimate(items, child.id);
    }
  }, 0);
}

// Helper to update child order
export function updateChildOrder(
  items: Record<string, TreeItem>,
  parentId: string
): string[] {
  return Object.values(items)
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => item.id);
}
