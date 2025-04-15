import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TreeItem,
  Branch,
  Leaf,
  FlatTreeData,
  CertaintyLevel,
} from "../types";
import {
  calculateTotalEstimate,
  updateChildOrder,
  CertaintyMultipliers,
} from "../types";
import { convertToMarkdown, parseMarkdown } from "../utils/markdown";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";

const defaultTreeData: FlatTreeData = {
  rootId: "root",
  items: {
    root: {
      id: "root",
      name: "My Project Tracker",
      type: "branch",
      parentId: null,
      childOrder: [],
      certainty: "high", // Default certainty
    },
  },
};

interface ProjectState {
  isConfirmationShown: boolean;
  treeData: FlatTreeData;
  updateItem: (updatedItem: TreeItem) => void;
  addItem: (parentId: string) => void;
  addBranch: () => void;
  moveItemUp: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  exportToMarkdown: () => void;
  copyToClipboard: () => Promise<void>;
  importFromMarkdown: (content: string) => void;
  resetData: () => void;
  getTotalEstimate: () => number;
  getProjectEstimates: () => { best: number; expected: number; worst: number };
  getEstimateWithCertainty: (branchId: string) => {
    best: number;
    expected: number;
    worst: number;
  };
  updateCertainty: (branchId: string, certainty: CertaintyLevel) => void;
  setTreeData: (treeData: FlatTreeData) => void;
  showConfirmation: () => void;
  hideConfirmation: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      isConfirmationShown: false,
      treeData: defaultTreeData,

      updateItem: (updatedItem: TreeItem) => {
        set((state) => ({
          treeData: {
            ...state.treeData,
            items: {
              ...state.treeData.items,
              [updatedItem.id]: updatedItem,
            },
          },
        }));
      },

      addItem: (parentId: string) => {
        set((state) => {
          const parent = state.treeData.items[parentId];
          if (
            !parent ||
            parent.type !== "branch" ||
            parent.parentId !== "root"
          ) {
            return state;
          }

          const newItem: Leaf = {
            id: nanoid(),
            name: "New Task",
            type: "leaf",
            estimate: "",
            parentId,
            completed: false,
          };

          return {
            treeData: {
              ...state.treeData,
              items: {
                ...state.treeData.items,
                [newItem.id]: newItem,
                [parentId]: {
                  ...parent,
                  childOrder: [...(parent.childOrder || []), newItem.id],
                },
              },
            },
          };
        });
      },

      addBranch: () => {
        set((state) => {
          const newBranch: Branch = {
            id: nanoid(),
            name: "New Section",
            type: "branch",
            parentId: "root",
            childOrder: [],
            certainty: "high", // Default certainty
          };

          const root = state.treeData.items.root;
          if (root.type !== "branch") return state;

          return {
            treeData: {
              ...state.treeData,
              items: {
                ...state.treeData.items,
                [newBranch.id]: newBranch,
                root: {
                  ...root,
                  childOrder: [...root.childOrder, newBranch.id],
                },
              },
            },
          };
        });
      },

      moveItemUp: (itemId: string) => {
        set((state) => {
          const item = state.treeData.items[itemId];
          if (!item || !item.parentId) return state;

          const parent = state.treeData.items[item.parentId];
          if (!parent || parent.type !== "branch") return state;

          const currentOrder =
            parent.childOrder ||
            updateChildOrder(state.treeData.items, parent.id);
          const currentIndex = currentOrder.indexOf(itemId);

          // If item is already first or not found, do nothing
          if (currentIndex <= 0) return state;

          // Create new order by swapping with previous item
          const newOrder = [...currentOrder];
          [newOrder[currentIndex - 1], newOrder[currentIndex]] = [
            newOrder[currentIndex],
            newOrder[currentIndex - 1],
          ];

          // Update parent with new order
          return {
            treeData: {
              ...state.treeData,
              items: {
                ...state.treeData.items,
                [parent.id]: {
                  ...parent,
                  childOrder: newOrder,
                },
              },
            },
          };
        });
      },

      deleteItem: (itemId: string) => {
        set((state) => {
          const item = state.treeData.items[itemId];
          if (!item) return state;

          const newItems = { ...state.treeData.items };

          // Helper function to recursively delete an item and its children
          const deleteRecursive = (id: string) => {
            const item = newItems[id];
            if (!item) return;

            // Delete all children first if it's a branch
            if (item.type === "branch") {
              Object.values(newItems)
                .filter((i) => i.parentId === id)
                .forEach((child) => deleteRecursive(child.id));
            }

            // Update parent's childOrder if exists
            if (item.parentId) {
              const parent = newItems[item.parentId];
              if (parent && parent.type === "branch") {
                parent.childOrder = parent.childOrder.filter(
                  (childId) => childId !== id
                );
              }
            }

            // Delete the item itself
            delete newItems[id];
          };

          deleteRecursive(itemId);

          return {
            treeData: {
              ...state.treeData,
              items: newItems,
            },
          };
        });
      },

      exportToMarkdown: () => {
        const { treeData } = get();
        const markdown = convertToMarkdown(treeData);
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${treeData.items[treeData.rootId].name
          .toLowerCase()
          .replace(/\s+/g, "-")}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("File exported successfully!");
      },

      copyToClipboard: async () => {
        try {
          const { treeData } = get();
          const markdown = convertToMarkdown(treeData);
          await navigator.clipboard.writeText(markdown);
          toast.success("Copied to clipboard!");
        } catch (error) {
          console.error("Failed to copy to clipboard:", error);
          toast.error("Failed to copy to clipboard");
        }
      },

      importFromMarkdown: (content: string) => {
        try {
          const newTreeData = parseMarkdown(content);
          set({ treeData: newTreeData });
          toast.success("File imported successfully!");
        } catch (error) {
          console.error("Failed to parse markdown:", error);
          toast.error(
            "Failed to import file. Please make sure it's a valid markdown file."
          );
        }
      },

      resetData: () => {
        if (
          window.confirm(
            "Are you sure you want to reset? This will clear all data."
          )
        ) {
          set({ treeData: defaultTreeData });
          toast.success("Data reset successfully!");
        }
      },

      getTotalEstimate: () => {
        const { treeData } = get();
        return calculateTotalEstimate(treeData.items, treeData.rootId);
      },

      getProjectEstimates: () => {
        const { treeData } = get();
        const root = treeData.items.root;

        if (root.type !== "branch") {
          return { best: 0, expected: 0, worst: 0 };
        }

        // Get all top-level sections
        const sections = root.childOrder
          .map((id) => treeData.items[id])
          .filter((item): item is Branch => item?.type === "branch");

        // Calculate aggregated estimates from all sections
        return sections.reduce(
          (totals, section) => {
            const sectionEstimates = get().getEstimateWithCertainty(section.id);
            return {
              best: totals.best + sectionEstimates.best,
              expected: totals.expected + sectionEstimates.expected,
              worst: totals.worst + sectionEstimates.worst,
            };
          },
          { best: 0, expected: 0, worst: 0 }
        );
      },

      getEstimateWithCertainty: (branchId: string) => {
        const { treeData } = get();
        const branch = treeData.items[branchId];

        if (!branch || branch.type !== "branch") {
          return { best: 0, expected: 0, worst: 0 };
        }

        const rawEstimate = calculateTotalEstimate(treeData.items, branchId);
        const certainty = branch.certainty || "high";
        const multipliers = CertaintyMultipliers[certainty];

        return {
          best: Math.round(rawEstimate * multipliers.best),
          expected: Math.round(rawEstimate * multipliers.expected),
          worst: Math.round(rawEstimate * multipliers.worst),
        };
      },

      updateCertainty: (branchId: string, certainty: CertaintyLevel) => {
        set((state) => {
          const branch = state.treeData.items[branchId];
          if (!branch || branch.type !== "branch") return state;

          return {
            treeData: {
              ...state.treeData,
              items: {
                ...state.treeData.items,
                [branchId]: {
                  ...branch,
                  certainty,
                },
              },
            },
          };
        });
      },

      setTreeData: (treeData: FlatTreeData) => {
        set({ treeData });
      },

      showConfirmation: () => {
        set({ isConfirmationShown: true });
      },

      hideConfirmation: () => {
        set({ isConfirmationShown: false });
      },
    }),
    {
      name: "project-tracker-storage",
    }
  )
);
