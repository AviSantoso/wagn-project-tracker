"use client";

import { useRef } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import { ProjectTrackerUI } from "../ui/ProjectTrackerUI";
import { personalWebsiteExample } from "../../exampleData";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function ProjectTrackerContainer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isConfirmationShown = useProjectStore(
    (state) => state.isConfirmationShown
  );
  const showConfirmation = useProjectStore((state) => state.showConfirmation);
  const hideConfirmation = useProjectStore((state) => state.hideConfirmation);
  const treeData = useProjectStore((state) => state.treeData);
  const updateItem = useProjectStore((state) => state.updateItem);
  const addBranch = useProjectStore((state) => state.addBranch);
  const resetData = useProjectStore((state) => state.resetData);
  const exportToMarkdown = useProjectStore((state) => state.exportToMarkdown);
  const copyToClipboard = useProjectStore((state) => state.copyToClipboard);
  const importFromMarkdown = useProjectStore(
    (state) => state.importFromMarkdown
  );
  const getProjectEstimates = useProjectStore(
    (state) => state.getProjectEstimates
  );
  const setTreeData = useProjectStore((state) => state.setTreeData);

  const handleUpdateRootName = (name: string) => {
    const rootItem = treeData.items[treeData.rootId];
    updateItem({
      ...rootItem,
      name,
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      importFromMarkdown(content);
    };
    reader.readAsText(file);

    // Reset the input so the same file can be imported again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTryExample = () => {
    showConfirmation();
  };

  const handleConfirmExample = () => {
    hideConfirmation();
    setTreeData(personalWebsiteExample);
  };

  const handleCancelExample = () => {
    hideConfirmation();
  };

  const projectEstimates = getProjectEstimates();

  return (
    <>
      <ProjectTrackerUI
        treeData={treeData}
        onUpdateRootName={handleUpdateRootName}
        onReset={resetData}
        onImport={handleImport}
        onCopy={copyToClipboard}
        onExport={exportToMarkdown}
        onAddBranch={addBranch}
        projectEstimates={projectEstimates}
        fileInputRef={fileInputRef}
        onTryExample={handleTryExample}
      />
      <ConfirmDialog
        open={isConfirmationShown}
        title="Replace current project with example?"
        description="This will overwrite your current project data with the example. Continue?"
        confirmLabel="Replace"
        cancelLabel="Cancel"
        onConfirm={handleConfirmExample}
        onCancel={handleCancelExample}
      />
    </>
  );
}
