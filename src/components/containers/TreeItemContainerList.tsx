import { useProjectStore } from "../../store/useProjectStore";
import { TreeItemContainer } from "./TreeItemContainer";

interface TreeItemContainerListProps {
  parentId: string;
}

export function TreeItemContainerList({
  parentId,
}: TreeItemContainerListProps) {
  const { treeData } = useProjectStore();

  const parent = treeData.items[parentId];
  if (!parent || parent.type !== "branch") return null;

  return (
    <>
      {parent.childOrder.map((childId) => (
        <TreeItemContainer key={childId} itemId={childId} />
      ))}
    </>
  );
}
