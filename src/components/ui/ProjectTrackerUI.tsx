"use client";

import type React from "react";
import { Toaster } from "react-hot-toast";
import type { FlatTreeData } from "../../types";
import { TreeItemContainerList } from "../containers/TreeItemContainerList";
import { EditableTitle } from "./EditableTitle";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  ClipboardIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface ProjectTrackerUIProps {
  treeData: FlatTreeData;
  onUpdateRootName: (name: string) => void;
  onReset: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCopy: () => void;
  onExport: () => void;
  onAddBranch: () => void;
  projectEstimates: { best: number; expected: number; worst: number };
  fileInputRef: React.RefObject<HTMLInputElement>;
  onTryExample: () => void;
}

export function ProjectTrackerUI({
  treeData,
  onUpdateRootName,
  onReset,
  onImport,
  onCopy,
  onExport,
  onAddBranch,
  projectEstimates,
  fileInputRef,
  onTryExample,
}: ProjectTrackerUIProps) {
  return (
    <div className="min-h-screen bg-[#F7F3EE] bg-canvas-texture font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#1A2B49",
              color: "#F7F3EE",
              borderRadius: "0.8rem",
            },
            success: {
              iconTheme: {
                primary: "#A8B8A0",
                secondary: "#F7F3EE",
              },
            },
          }}
        />

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A2B49] mb-2">
            Wagn Project Tracker
          </h1>
          <p className="text-[#8B6D5C]">
            Organize, estimate, and track your project tasks
          </p>
          <p className="text-[#8B6D5C]">
            See the original blog post{" "}
            <a
              href="https://avisantoso.com/rethinking-pert"
              className="text-[#4A90E2] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
          </p>
        </header>

        <div className="flex items-center justify-between mb-6 w-full">
          <div className="flex flex-wrap gap-2">
            <input
              type="file"
              accept=".md"
              onChange={onImport}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={onReset}
              className="px-4 py-2 bg-white border border-[#8B6D5C] text-[#8B6D5C] rounded-xl hover:bg-[#8B6D5C]/5 transition-colors duration-300 ease-in-out flex items-center gap-2"
              title="Reset All Data"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-[#4A90E2] text-[#4A90E2] rounded-xl hover:bg-[#4A90E2]/5 transition-colors duration-300 ease-in-out flex items-center gap-2"
              title="Import from Markdown"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={onCopy}
              className="px-4 py-2 bg-white border border-[#A8B8A0] text-[#A8B8A0] rounded-xl hover:bg-[#A8B8A0]/5 transition-colors duration-300 ease-in-out flex items-center gap-2"
              title="Copy to Clipboard"
            >
              <ClipboardIcon className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={onExport}
              className="px-4 py-2 bg-white border border-[#FF7F6B] text-[#FF7F6B] rounded-xl hover:bg-[#FF7F6B]/5 transition-colors duration-300 ease-in-out flex items-center gap-2"
              title="Export to Markdown"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="flex-1 flex items-center">
            <div className="flex-1" />
            <button
              onClick={onTryExample}
              className="px-4 py-2 bg-white border border-[#4A90E2] text-[#4A90E2] rounded-xl hover:bg-[#4A90E2]/5 transition-colors duration-300 ease-in-out flex items-center gap-2"
              title="Try Example Project"
            >
              <SparklesIcon className="w-4 h-4" />
              Try Example
            </button>
          </div>
        </div>

        {/* Project Title Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-soft border border-[#8B6D5C]/20 flex-1">
            <div className="flex items-center">
              <span className="text-[#8B6D5C] mr-3">Project:</span>
              <EditableTitle
                initialValue={treeData.items[treeData.rootId].name}
                onSave={onUpdateRootName}
                className="flex-grow font-serif text-xl text-[#1A2B49]"
              />
            </div>
          </div>
          <button
            onClick={onAddBranch}
            className="h-[60px] w-[60px] flex items-center justify-center bg-[#4A90E2] text-white rounded-xl hover:opacity-90 shadow-soft hover:shadow-glow-blue transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
            title="Add New Section"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-soft border border-[#8B6D5C]/20 mb-6">
          <div className="space-y-4">
            {treeData.items.root.type === "branch" &&
            treeData.items.root.childOrder.length > 0 ? (
              <TreeItemContainerList parentId="root" />
            ) : (
              <p className="text-[#8B6D5C]/70 italic text-sm py-4 text-center">
                No sections yet. Click the "+" button to add a section.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-soft border border-[#8B6D5C]/20">
          <h2 className="text-xl font-serif font-medium text-[#1A2B49] mb-4">
            Project Estimates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-[#4A90E2]/30 rounded-xl">
              <p className="text-sm text-[#8B6D5C] mb-1">Best case</p>
              <p className="text-2xl font-serif text-[#4A90E2]">
                {projectEstimates.best}h
              </p>
            </div>
            <div className="p-4 bg-white border border-[#8B6D5C]/30 rounded-xl">
              <p className="text-sm text-[#8B6D5C] mb-1">Expected case</p>
              <p className="text-2xl font-serif text-[#8B6D5C]">
                {projectEstimates.expected}h
              </p>
            </div>
            <div className="p-4 bg-white border border-[#FF7F6B]/30 rounded-xl">
              <p className="text-sm text-[#8B6D5C] mb-1">Worst case</p>
              <p className="text-2xl font-serif text-[#FF7F6B]">
                {projectEstimates.worst}h
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <footer className="mt-8 pt-6 border-t border-[#8B6D5C]/20 text-center text-sm text-[#8B6D5C]">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://wagn.ai"
              className="hover:text-[#4A90E2] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wagn AI
            </a>
          </p>
          <p className="mt-2 text-xs">MIT License</p>
        </footer>
      </div>
    </div>
  );
}
