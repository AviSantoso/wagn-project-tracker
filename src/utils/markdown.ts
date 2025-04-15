import type {
  TreeItem,
  Branch,
  Leaf,
  EstimateValue,
  FlatTreeData,
  CertaintyLevel,
} from "../types";
import {
  calculateTotalEstimate,
  getChildren,
  CertaintyMultipliers,
  EstimateValues, // Import EstimateValues for validation
} from "../types";
import { nanoid } from "nanoid";

// Helper to create consistent indentation
function getIndentation(depth: number): string {
  return "  ".repeat(depth);
}

// --- Export to Markdown ---

export function convertToMarkdown(treeData: FlatTreeData): string {
  // Recursive function to process each item
  function processItem(itemId: string, depth = 0): string {
    const item = treeData.items[itemId];
    if (!item) return ""; // Should not happen in valid data

    const indent = getIndentation(depth);

    if (item.type === "leaf") {
      // Use standard Markdown task list format
      const check = item.completed ? "[x]" : "[ ]";
      const estimateStr = item.estimate || "unestimated"; // Use "unestimated" for empty string
      return `${indent}- ${check} ${item.name} (${estimateStr})\n`;
    } else {
      // Branch item
      const certaintyTag = item.certainty
        ? ` [Certainty: ${item.certainty}]`
        : "";
      const header = `${indent}- ${item.name}${certaintyTag}\n`;

      // Process children recursively
      const childrenContent = item.childOrder
        .map((childId) => processItem(childId, depth + 1))
        .join("");

      return header + childrenContent;
    }
  }

  const root = treeData.items[treeData.rootId];
  if (!root || root.type !== "branch") {
    console.error("Invalid root item in treeData");
    return "# Invalid Project Data\n";
  }

  // Calculate project estimates based on section certainty levels
  let bestTotal = 0;
  let expectedTotal = 0;
  let worstTotal = 0;

  root.childOrder.forEach((sectionId) => {
    const section = treeData.items[sectionId];
    if (section && section.type === "branch") {
      const rawEstimate = calculateTotalEstimate(treeData.items, section.id);
      const certainty = section.certainty || "high"; // Default to high if missing
      const multipliers = CertaintyMultipliers[certainty];

      bestTotal += Math.round(rawEstimate * multipliers.best);
      expectedTotal += Math.round(rawEstimate * multipliers.expected);
      worstTotal += Math.round(rawEstimate * multipliers.worst);
    }
  });

  // Build the final Markdown string
  const title = `# ${root.name}\n\n`;
  const content = root.childOrder
    .map((childId) => processItem(childId, 0)) // Start children at depth 0
    .join("");
  const estimatesSection = `\n## Remaining Estimates\n- Best case: ${bestTotal}h\n- Expected case: ${expectedTotal}h\n- Worst case: ${worstTotal}h`;

  return title + content + estimatesSection;
}

// --- Import from Markdown ---

// Helper to validate if a string is a valid EstimateValue
function isValidEstimateValue(value: string): value is EstimateValue {
  return EstimateValues.includes(value as EstimateValue);
}

export function parseMarkdown(markdown: string): FlatTreeData {
  const lines = markdown.split("\n");

  let title = "My Project Estimate"; // Default title
  const contentLines: string[] = [];
  let estimatesSectionReached = false;

  // Separate title, content, and estimate lines
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("## Remaining Estimates")) {
      estimatesSectionReached = true;
      continue; // Skip estimate lines from main content processing
    }
    if (estimatesSectionReached || !trimmedLine) {
      continue; // Skip empty lines and lines after estimates
    }

    if (trimmedLine.startsWith("# ")) {
      title = trimmedLine.substring(2).trim();
    } else {
      // Only add non-empty, non-title lines before estimates section
      contentLines.push(line);
    }
  }

  const items: Record<string, TreeItem> = {
    root: {
      id: "root",
      type: "branch",
      name: title,
      parentId: null,
      childOrder: [],
      certainty: "high", // Default certainty for root
    },
  };

  // Stack to keep track of parent IDs based on indentation
  const parentStack: { id: string; depth: number }[] = [
    { id: "root", depth: -1 },
  ];

  for (const line of contentLines) {
    // Skip lines that are only whitespace
    if (!line.trim()) continue;

    const indentMatch = line.match(/^(\s*)/);
    const indentation = indentMatch ? indentMatch[1].length : 0;
    const depth = Math.floor(indentation / 2); // Assuming 2 spaces per indent level

    // Adjust parent stack based on current depth
    while (
      parentStack.length > 1 &&
      depth <= parentStack[parentStack.length - 1].depth
    ) {
      parentStack.pop();
    }
    const parentId = parentStack[parentStack.length - 1].id;

    // Extract certainty if present (applies only to branches)
    let certainty: CertaintyLevel = "high"; // Default for branches
    let lineWithoutCertainty = line;
    const certaintyMatch = line.match(/ \[Certainty: (low|medium|high)\]/i);
    if (certaintyMatch) {
      certainty = certaintyMatch[1].toLowerCase() as CertaintyLevel;
      lineWithoutCertainty = line.replace(
        / \[Certainty: (low|medium|high)\]/i,
        ""
      );
    }

    // Try parsing as a Leaf (task item) first
    const leafMatch = lineWithoutCertainty.match(
      /^\s*-\s+\[([ x])\]\s+(.+?)\s+\((.*?)\)\s*$/
    );
    if (leafMatch) {
      const [, status, name, estimateStr] = leafMatch;
      const isCompleted = status === "x";
      const cleanedEstimate = estimateStr.trim();
      const estimate = isValidEstimateValue(cleanedEstimate)
        ? cleanedEstimate
        : ""; // Default to empty if invalid/unestimated

      const id = nanoid();
      const leaf: Leaf = {
        id,
        type: "leaf",
        name: name.trim(),
        estimate,
        parentId,
        completed: isCompleted,
      };
      items[id] = leaf;

      // Add to parent's childOrder
      const parent = items[parentId];
      if (parent && parent.type === "branch") {
        parent.childOrder.push(id);
      }
    } else {
      // Try parsing as a Branch
      const branchMatch = lineWithoutCertainty.match(/^\s*-\s+(.+?)\s*$/);
      if (branchMatch) {
        const [, name] = branchMatch;
        const id = nanoid();
        const branch: Branch = {
          id,
          type: "branch",
          name: name.trim(),
          parentId,
          childOrder: [],
          certainty, // Use extracted or default certainty
        };
        items[id] = branch;

        // Add to parent's childOrder
        const parent = items[parentId];
        if (parent && parent.type === "branch") {
          parent.childOrder.push(id);
        }

        // Push this branch onto the stack as it can be a parent
        parentStack.push({ id, depth });
      } else {
        console.warn("Skipping unparseable line:", line);
      }
    }
  }

  return {
    items,
    rootId: "root",
  };
}
