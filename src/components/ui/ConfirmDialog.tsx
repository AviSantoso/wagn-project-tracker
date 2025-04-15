import React from "react";
import Modal from "react-modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={open}
      onRequestClose={onCancel} // Close on overlay click or ESC
      contentLabel={title} // For accessibility
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "relative",
          inset: "auto",
          border: "1px solid rgba(139, 109, 92, 0.3)", // border-[#8B6D5C]/30
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "0.75rem", // rounded-xl
          outline: "none",
          padding: "1.5rem", // p-6
          minWidth: "320px",
          maxWidth: "90vw",
        },
      }}
    >
      <div className="bg-white rounded-xl p-6 min-w-[320px] max-w-[90vw]">
        <h2 className="text-lg font-semibold mb-2 text-[#1A2B49]">{title}</h2>
        <p className="mb-4 text-[#8B6D5C]">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-[#F7F3EE] text-[#8B6D5C] border border-[#8B6D5C]/30 hover:bg-[#8B6D5C]/10 transition"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#4A90E2] text-white hover:bg-[#357ABD] transition"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
