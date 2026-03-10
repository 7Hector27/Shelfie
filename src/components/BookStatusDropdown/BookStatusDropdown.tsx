import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ConfirmationModal from "@/components/ConfirmationModal";

import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { Status } from "@/util/types";
import { useAuth } from "@/context/AuthProvider";
import { redirectTo } from "@/util/clientUtils";

import styles from "./BookStatusDropdown.module.scss";

/* =====================
   Helpers
===================== */

const isStatus = (value: unknown): value is Status =>
  value === "want_to_read" ||
  value === "reading" ||
  value === "completed" ||
  value === "dropped";

const labelMap: Record<Status, string> = {
  want_to_read: "Want to Read",
  reading: "Currently Reading",
  completed: "Read",
  dropped: "DNF (Did Not Finish)",
};

type ExternalSource = "open_library" | "google_books";

type UpsertPayload = {
  book_id: string;
  external_source: ExternalSource;
  status: Status;
  title?: string;
  author?: string;
  description?: string | null;
  cover_url?: string | null;
  author_id?: string;
};

interface Props {
  bookId: string;
  externalSource: ExternalSource;
  book?: Omit<UpsertPayload, "book_id" | "external_source" | "status">;
  allowRemove?: boolean;
  onStatusChange?: (next: Status) => void;
  // Called whenever the dropdown opens or closes — used by parent to manage z-index
  onOpenChange?: (isOpen: boolean) => void;
}

export default function BookStatusDropdown({
  bookId,
  externalSource,
  book,
  allowRemove = true,
  onStatusChange,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const toggleDropdown = (next: boolean) => {
    setIsOpen(next);
    onOpenChange?.(next);
  };

  const statusQueryKey = useMemo(() => ["userBookStatus", bookId], [bookId]);

  const fetchUserBookStatus = async (): Promise<Status | null> => {
    try {
      const res = await apiGet<{ status: string | null }>(
        `/userbooks/getBookById/${bookId}`,
      );
      return isStatus(res.status) ? res.status : null;
    } catch {
      return null;
    }
  };

  const { data: userBookStatus } = useQuery({
    queryKey: statusQueryKey,
    queryFn: fetchUserBookStatus,
    enabled: !!bookId,
  });

  const currentStatus: Status = userBookStatus ?? "want_to_read";

  const upsertUserBook = useMutation({
    mutationFn: (nextStatus: Status) =>
      apiPost("/userbooks", {
        book_id: bookId,
        external_source: externalSource,
        status: nextStatus,
        ...(book ?? {}),
      } satisfies UpsertPayload),
    onSuccess: (_data, nextStatus) => {
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
      onStatusChange?.(nextStatus);
    },
  });

  const removeUserBook = useMutation({
    mutationFn: () => apiDelete(`/userbooks/${bookId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
      setShowRemoveModal(false);
      toggleDropdown(false);
    },
  });

  const saveStatus = (nextStatus: Status) => {
    if (!user) {
      redirectTo("/signin");

      return;
    }
    setIsOpen(false);
    upsertUserBook.mutate(nextStatus);
  };
  return (
    <>
      {allowRemove && userBookStatus && showRemoveModal && (
        <ConfirmationModal
          isOpen={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
          title="Remove from shelf?"
          copy="This will remove the book from all your shelves."
          confirmCopy="Remove"
          cancelCopy="Cancel"
          onConfirm={() => removeUserBook.mutate()}
        />
      )}

      <div className={styles.wrapper}>
        <div
          className={`${styles.status} ${userBookStatus ? styles[currentStatus] : ""}`}
        >
          <button
            className={styles.actionBtn}
            onClick={() => saveStatus(currentStatus)}
            disabled={upsertUserBook.isPending}
          >
            {userBookStatus && <span className={styles.checkmark}>✓</span>}
            {labelMap[currentStatus]}
          </button>

          <button
            className={styles.dropdownBtn}
            onClick={() => toggleDropdown(!isOpen)}
            disabled={upsertUserBook.isPending}
          >
            ▼
          </button>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            {(
              ["want_to_read", "reading", "completed", "dropped"] as Status[]
            ).map((s) => (
              <button
                key={s}
                className={currentStatus === s ? styles.active : ""}
                onClick={() => saveStatus(s)}
              >
                {labelMap[s]}
              </button>
            ))}

            {allowRemove && userBookStatus && (
              <button
                className={styles.danger}
                onClick={() => setShowRemoveModal(true)}
              >
                Remove from my shelf
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
