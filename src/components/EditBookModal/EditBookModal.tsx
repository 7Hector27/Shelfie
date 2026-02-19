import React, { useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./EditBookModal.module.scss";

const statusEnum = z.enum(["reading", "want_to_read", "completed", "dropped"]);

const editBookSchema = z
  .object({
    status: statusEnum,
    rating: z
      .union([z.number().min(0).max(5), z.nan()])
      .transform((v) => (Number.isNaN(v as number) ? null : (v as number)))
      .nullable(),
    review: z.string().max(2000).nullable(),
    date_started: z.string().nullable(), // keep as YYYY-MM-DD string for input[type="date"]
    date_finished: z.string().nullable(),
    favorite: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.date_started || !data.date_finished) return true;
      return data.date_started <= data.date_finished;
    },
    {
      message: "Finished date can’t be before started date",
      path: ["date_finished"],
    },
  );

export type EditBookFormValues = z.infer<typeof editBookSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: EditBookFormValues) => Promise<void> | void;

  book: {
    title: string;
    author: string;
    cover_url?: string | null;

    status: "reading" | "want_to_read" | "completed" | "dropped";
    rating: number | null;
    review: string | null;
    date_started: string | null; // YYYY-MM-DD or null
    date_finished: string | null; // YYYY-MM-DD or null
    favorite: boolean;
  };
};

const STATUS_TABS: Array<{ label: string; value: Props["book"]["status"] }> = [
  { label: "Reading", value: "reading" },
  { label: "Want", value: "want_to_read" },
  { label: "Read", value: "completed" },
  { label: "Dropped", value: "dropped" },
];

const EditBookModal = ({ isOpen, onClose, onSave, book }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditBookFormValues>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      status: book.status,
      rating: book.rating,
      review: book.review ?? null,
      date_started: book.date_started ?? null,
      date_finished: book.date_finished ?? null,
      favorite: book.favorite ?? false,
    },
  });

  // When modal opens / book changes, sync defaults without changing your JSX structure elsewhere
  useEffect(() => {
    if (!isOpen) return;
    reset({
      status: book.status,
      rating: book.rating,
      review: book.review ?? null,
      date_started: book.date_started ?? null,
      date_finished: book.date_finished ?? null,
      favorite: book.favorite ?? false,
    });
  }, [isOpen, book, reset]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const status = watch("status");
  const favorite = watch("favorite");

  if (!isOpen) return null;

  const submit = async (values: EditBookFormValues) => {
    await onSave(values);
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Edit Book"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Edit Book</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {/* LEFT PANEL */}
          <div className={styles.left}>
            <div className={styles.coverWrap}>
              <Image
                src={book.cover_url || "/images/book-placeholder.webp"}
                alt={book.title}
                width={280}
                height={420}
                className={styles.coverImg}
                unoptimized={!!book.cover_url}
              />
            </div>

            <div className={styles.leftMeta}>
              <h3 className={styles.leftTitle}>{book.title}</h3>
              <p className={styles.leftAuthor}>{book.author}</p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <form className={styles.right} onSubmit={handleSubmit(submit)}>
            <div className={styles.bookMetaTop}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>{book.author}</p>

              <div className={styles.inlineMetaRow}>
                <div className={styles.starsRow}>
                  {/* You can swap this for your StarRatingDisplay if it supports onChange */}
                  <label className={styles.fieldLabel}>Rating</label>
                  <select
                    className={styles.ratingSelect}
                    {...register("rating", {
                      setValueAs: (v) => {
                        if (v === "" || v == null) return null;
                        const n = Number(v);
                        return Number.isNaN(n) ? null : n;
                      },
                    })}
                  >
                    <option value="">Not rated</option>

                    {Array.from({ length: 20 }, (_, i) => {
                      const value = (i + 1) * 0.25;
                      return (
                        <option key={value} value={value}>
                          {value.toFixed(2)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <span className={`${styles.statusChip} ${styles[status]}`}>
                  {status.replaceAll("_", " ")}
                </span>
              </div>
            </div>

            {/* REVIEW */}
            <div className={styles.section}>
              <label className={styles.sectionTitle}>Review</label>
              <textarea
                className={styles.textarea}
                placeholder="Write your thoughts..."
                {...register("review")}
              />
              {errors.review && (
                <p className={styles.error}>{errors.review.message}</p>
              )}
            </div>

            {/* STATUS */}
            <div className={styles.section}>
              <label className={styles.sectionTitle}>Status</label>
              <div className={styles.segmented}>
                {STATUS_TABS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`${styles.segmentBtn} ${status === t.value ? styles.active : ""}`}
                    onClick={() => setValue("status", t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DATES */}
            {/* DATES */}
            <div className={styles.section}>
              <label className={styles.sectionTitle}>Dates</label>

              <div className={styles.dateGrid}>
                {/* DATE STARTED */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Date Started</label>
                  <DatePicker
                    selected={
                      watch("date_started")
                        ? new Date(watch("date_started") as string)
                        : null
                    }
                    onChange={(date: Date | null) =>
                      setValue(
                        "date_started",
                        date ? date.toISOString().split("T")[0] : null,
                        { shouldValidate: true },
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    className={styles.input}
                    isClearable
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    scrollableYearDropdown
                    yearDropdownItemNumber={50}
                  />
                </div>

                {/* DATE FINISHED */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Date Finished</label>
                  <DatePicker
                    selected={
                      watch("date_finished")
                        ? new Date(watch("date_finished") as string)
                        : null
                    }
                    onChange={(date: Date | null) =>
                      setValue(
                        "date_finished",
                        date ? date.toISOString().split("T")[0] : null,
                        { shouldValidate: true },
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    className={styles.input}
                    isClearable
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    scrollableYearDropdown
                    yearDropdownItemNumber={50}
                  />

                  {errors.date_finished && (
                    <p className={styles.error}>
                      {errors.date_finished.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* FAVORITE */}
            <div className={styles.section}>
              <label className={styles.sectionTitle}>Favorite</label>
              <button
                type="button"
                className={`${styles.toggle} ${favorite ? styles.on : ""}`}
                onClick={() => setValue("favorite", !favorite)}
                aria-pressed={favorite}
              >
                <span className={styles.knob} />
              </button>
              <span className={styles.toggleLabel}>Mark as favorite</span>
            </div>

            {/* FOOTER */}
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;
