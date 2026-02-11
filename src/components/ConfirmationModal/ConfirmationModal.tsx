import React from "react";
import styles from "./ConfirmationModal.module.scss";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  copy: string;

  confirmCopy: string;
  onConfirm: () => void;

  cancelCopy?: string;
  onCancel?: () => void;

  isLoading?: boolean;
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  title = "Are you sure?",
  copy,
  confirmCopy,
  onConfirm,
  cancelCopy = "Cancel",
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h3>{title}</h3>
        <p>{copy}</p>

        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelCopy}
          </button>

          <button
            className={styles.confirm}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Please wait…" : confirmCopy}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
