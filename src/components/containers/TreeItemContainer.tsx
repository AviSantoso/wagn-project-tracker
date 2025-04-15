import { useProjectStore } from "../../store/useProjectStore";
import { TreeItemUI } from "../ui/TreeItemUI";
import { isEstimateHigh } from "../../utils/fibonacci";
import {
  EstimateValues,
  EstimateValueToHours,
  getChildren,
  type EstimateValue,
  type CertaintyLevel,
} from "../../types";

interface TreeItemContainerProps {
  itemId: string;
}

export function TreeItemContainer({ itemId }: TreeItemContainerProps) {
  const {
    treeData,
    updateItem,
    addItem,
    moveItemUp,
    deleteItem,
    getEstimateWithCertainty,
    updateCertainty,
  } = useProjectStore();

  const item = treeData.items[itemId];
  if (!item) return null;

  const isLeaf = item.type === "leaf";

  // For leaf items
  const estimateStyle =
    isLeaf && isEstimateHigh(item.estimate) ? "text-[#FF7F6B] font-bold" : "";

  // Check if this item can be moved up
  const parent = item.parentId ? treeData.items[item.parentId] : null;
  const canMoveUp =
    parent?.type === "branch" &&
    parent.childOrder &&
    parent.childOrder.indexOf(item.id) > 0;

  // For branch items
  const children =
    item.type === "branch" ? getChildren(treeData.items, item.id) : [];
  const hasChildren = children.length > 0;

  const totalEstimate =
    item.type === "branch"
      ? children.reduce((sum, child) => {
          if (child.type === "leaf") {
            return child.completed
              ? sum
              : sum + EstimateValueToHours[child.estimate];
          }
          return sum;
        }, 0)
      : 0;

  // Get estimates with certainty for branch items
  const estimatesWithCertainty =
    item.type === "branch" && item.parentId === "root"
      ? getEstimateWithCertainty(item.id)
      : undefined;

  const handleToggleComplete = () => {
    if (item.type === "leaf") {
      updateItem({
        ...item,
        completed: !item.completed,
      });
    }
  };

  const handleUpdateName = (name: string) => {
    updateItem({
      ...item,
      name,
    });
  };

  const handleEstimateChange = (estimate: EstimateValue) => {
    if (item.type === "leaf") {
      updateItem({
        ...item,
        estimate,
      });
    }
  };

  const handleCertaintyChange = (certainty: CertaintyLevel) => {
    if (item.type === "branch") {
      updateCertainty(item.id, certainty);
    }
  };

  const handleAddItem = () => {
    if (item.type === "branch") {
      addItem(item.id);
    }
  };

  const handleMoveUp = () => {
    moveItemUp(item.id);
  };

  const handleDelete = () => {
    deleteItem(item.id);
  };

  return (
    <TreeItemUI
      item={item}
      estimateStyle={estimateStyle}
      canMoveUp={canMoveUp}
      isLeaf={isLeaf}
      totalEstimate={totalEstimate}
      hasChildren={hasChildren}
      estimateValues={EstimateValues}
      certaintyLevel={item.type === "branch" ? item.certainty : undefined}
      estimatesWithCertainty={estimatesWithCertainty}
      onToggleComplete={handleToggleComplete}
      onMoveUp={handleMoveUp}
      onUpdateName={handleUpdateName}
      onEstimateChange={handleEstimateChange}
      onCertaintyChange={
        item.type === "branch" && item.parentId === "root"
          ? handleCertaintyChange
          : undefined
      }
      onAddItem={
        item.type === "branch" && item.parentId === "root"
          ? handleAddItem
          : undefined
      }
      onDelete={handleDelete}
      children={
        item.type === "branch" && item.parentId === "root" && hasChildren ? (
          children.map((child) => (
            <TreeItemContainer key={child.id} itemId={child.id} />
          ))
        ) : item.type === "branch" && item.parentId === "root" ? (
          <p className="text-sm text-[#8B6D5C]/60 italic py-3">
            No tasks yet. Click '+' to add a task.
          </p>
        ) : null
      }
    />
  );
}
