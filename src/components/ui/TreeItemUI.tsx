"use client";

import type React from "react";
import type {
  TreeItem,
  Leaf,
  EstimateValue,
  CertaintyLevel,
} from "../../types";
import { EditableTitle } from "./EditableTitle";
import {
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface TreeItemUIProps {
  item: TreeItem;
  estimateStyle: string;
  canMoveUp: boolean;
  isLeaf: boolean;
  totalEstimate?: number;
  hasChildren?: boolean;
  estimateValues: EstimateValue[];
  certaintyLevel?: CertaintyLevel;
  estimatesWithCertainty?: { best: number; expected: number; worst: number };
  onToggleComplete?: () => void;
  onMoveUp: () => void;
  onUpdateName: (name: string) => void;
  onEstimateChange: (estimate: EstimateValue) => void;
  onCertaintyChange?: (certainty: CertaintyLevel) => void;
  onAddItem?: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export function TreeItemUI({
  item,
  estimateStyle,
  canMoveUp,
  isLeaf,
  totalEstimate = 0,
  hasChildren = false,
  estimateValues,
  certaintyLevel,
  estimatesWithCertainty,
  onToggleComplete,
  onMoveUp,
  onUpdateName,
  onEstimateChange,
  onCertaintyChange,
  onAddItem,
  onDelete,
  children,
}: TreeItemUIProps) {
  if (isLeaf) {
    const leaf = item as Leaf;

    return (
      <div className="flex items-center space-x-3 py-2">
        <button
          onClick={onToggleComplete}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ease-in-out ${
            leaf.completed
              ? "bg-[#A8B8A0] text-white"
              : "bg-white border border-[#8B6D5C]/30 text-transparent hover:bg-[#F7F3EE]"
          }`}
          title={leaf.completed ? "Mark as Incomplete" : "Mark as Complete"}
        >
          <CheckIcon className="w-4 h-4" />
        </button>

        {canMoveUp && (
          <button
            onClick={onMoveUp}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#8B6D5C]/30 text-[#8B6D5C] rounded-lg hover:bg-[#F7F3EE] transition-colors duration-300 ease-in-out"
            title="Move Up"
          >
            <ChevronUpIcon className="w-4 h-4" />
          </button>
        )}

        <EditableTitle
          initialValue={item.name}
          onSave={onUpdateName}
          className={`flex-grow text-sm text-[#1A2B49] cursor-pointer hover:bg-[#F7F3EE] px-3 py-1.5 rounded-xl transition-colors duration-300 ease-in-out ${
            leaf.completed ? "line-through text-[#8B6D5C]/60" : ""
          }`}
        />

        <select
          value={leaf.estimate}
          onChange={(e) => onEstimateChange(e.target.value as EstimateValue)}
          className={`border border-[#8B6D5C]/30 rounded-xl px-3 py-1.5 text-sm ${estimateStyle} ${
            leaf.completed ? "opacity-50" : ""
          } 
                    appearance-none bg-no-repeat
                     focus:outline-none focus:ring-1 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 ease-in-out`}
          disabled={leaf.completed}
        >
          {estimateValues.map((value) => (
            <option key={value} value={value}>
              {value || "—"}
            </option>
          ))}
        </select>

        <button
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center bg-white border border-[#FF7F6B]/30 text-[#FF7F6B] rounded-lg hover:bg-[#FF7F6B]/10 transition-colors duration-300 ease-in-out"
          title="Delete Item"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    );
  } else {
    // Branch rendering
    return (
      <div className="mb-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-[#8B6D5C]/10">
            {canMoveUp && (
              <button
                onClick={onMoveUp}
                className="w-8 h-8 flex items-center justify-center bg-white border border-[#8B6D5C]/30 text-[#8B6D5C] rounded-lg hover:bg-[#F7F3EE] transition-colors duration-300 ease-in-out"
                title="Move Up"
              >
                <ChevronUpIcon className="w-4 h-4" />
              </button>
            )}

            <EditableTitle
              initialValue={item.name}
              onSave={onUpdateName}
              className="flex-grow font-serif font-medium text-[#1A2B49] cursor-pointer hover:bg-[#F7F3EE] px-3 py-1.5 rounded-xl transition-colors duration-300 ease-in-out"
            />

            <span className="text-sm text-[#8B6D5C] bg-[#F7F3EE] px-3 py-1.5 rounded-xl">
              {totalEstimate}h
            </span>

            {onAddItem && (
              <button
                onClick={onAddItem}
                className="w-8 h-8 flex items-center justify-center bg-white border border-[#A8B8A0]/30 text-[#A8B8A0] rounded-lg hover:bg-[#A8B8A0]/10 transition-colors duration-300 ease-in-out"
                title="Add Task"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            )}

            {!hasChildren && (
              <button
                onClick={onDelete}
                className="w-8 h-8 flex items-center justify-center bg-white border border-[#FF7F6B]/30 text-[#FF7F6B] rounded-full hover:bg-[#FF7F6B]/10 transition-colors duration-300 ease-in-out"
                title="Delete Branch"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {children && (
            <div className="ml-6 pl-4 border-l-2 border-[#8B6D5C]/10 space-y-1 mt-2">
              {children}
            </div>
          )}

          {/* Certainty selector and estimates for branches with parent=root */}
          {item.parentId === "root" &&
            onCertaintyChange &&
            certaintyLevel &&
            estimatesWithCertainty && (
              <div className="ml-6 flex justify-between items-center mt-1 text-xs border-t border-[#8B6D5C]/5 pt-2 transition-opacity duration-300">
                <div className="flex items-center gap-1">
                  <span className="text-[#8B6D5C]/50">Uncertainty:</span>
                  <div className="flex border border-[#8B6D5C]/5 rounded-lg overflow-hidden">
                    <button
                      onClick={() => onCertaintyChange("low")}
                      className={`px-2 py-1 ${
                        certaintyLevel === "low"
                          ? "bg-[#8B6D5C]/5 text-[#1A2B49]/70"
                          : "text-[#8B6D5C]/50 hover:bg-[#8B6D5C]/5"
                      }`}
                      title="Low Certainty"
                    >
                      S
                    </button>
                    <button
                      onClick={() => onCertaintyChange("medium")}
                      className={`px-2 py-1 ${
                        certaintyLevel === "medium"
                          ? "bg-[#8B6D5C]/5 text-[#1A2B49]/70"
                          : "text-[#8B6D5C]/50 hover:bg-[#8B6D5C]/5"
                      }`}
                      title="Medium Certainty"
                    >
                      M
                    </button>
                    <button
                      onClick={() => onCertaintyChange("high")}
                      className={`px-2 py-1 ${
                        certaintyLevel === "high"
                          ? "bg-[#8B6D5C]/5 text-[#1A2B49]/70"
                          : "text-[#8B6D5C]/50 hover:bg-[#8B6D5C]/5"
                      }`}
                      title="High Certainty"
                    >
                      L
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 text-[#8B6D5C]/50">
                  <span>
                    Best:{" "}
                    <span className="text-[#1A2B49]/70">
                      {estimatesWithCertainty.best}h
                    </span>
                  </span>
                  <span>
                    Expected:{" "}
                    <span className="text-[#1A2B49]/70">
                      {estimatesWithCertainty.expected}h
                    </span>
                  </span>
                  <span>
                    Worst:{" "}
                    <span className="text-[#1A2B49]/70">
                      {estimatesWithCertainty.worst}h
                    </span>
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}
