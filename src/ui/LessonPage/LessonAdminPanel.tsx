"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactElement,
} from "react";

import { FLOW_LIST_ROW_CLASS } from "@/src/constants/styles";
import {
  createLesson,
  deleteLesson,
  updateLesson,
} from "@/src/services/lesson";
import type { CreateLessonInput, Lesson, UpdateLessonInput } from "@/src/types";
import {
  emptyLessonForm,
  lessonToFormState,
  LessonFormModal,
  type LessonFormMode,
  type LessonFormState,
} from "@/src/ui/LessonPage/LessonFormModal";
import { DeleteLessonModal } from "@/src/ui/LessonPage/DeleteLessonModal";

type Props = {
  readonly courseId: string;
  readonly initialLessons: readonly Lesson[];
};

export function LessonAdminPanel({
  courseId,
  initialLessons,
}: Props): ReactElement {
  const { getToken } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(
    [...initialLessons].sort((a, b) => a.order - b.order),
  );

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [mode, setMode] = useState<LessonFormMode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LessonFormState>(emptyLessonForm);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setLessons([...initialLessons].sort((a, b) => a.order - b.order));
  }, [initialLessons]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const refreshList = useCallback((): void => {
    router.refresh();
  }, [router]);

  const openCreate = (): void => {
    setFormError(null);
    setMode("create");
    setEditingId(null);
    const nextOrder = lessons.length > 0
      ? Math.max(...lessons.map((l) => l.order)) + 1
      : 1;
    setForm(emptyLessonForm(nextOrder));
    setFormModalOpen(true);
  };

  const openEdit = (l: Lesson): void => {
    setFormError(null);
    setMode("edit");
    setEditingId(l.id);
    setForm(lessonToFormState(l));
    setFormModalOpen(true);
  };

  const closeFormModal = (): void => {
    if (!saving) {
      setFormModalOpen(false);
      setFormError(null);
    }
  };

  const openDeleteModal = (l: Lesson): void => {
    setDeleteError(null);
    setDeleteTarget({ id: l.id, title: l.title });
  };

  const closeDeleteModal = (): void => {
    if (!deleting) {
      setDeleteTarget(null);
      setDeleteError(null);
    }
  };

  const onSubmitForm = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError(null);

    const token = await getToken();
    if (!token) {
      setFormError("You must be signed in.");
      return;
    }

    const orderNum = Number(form.order);
    if (!Number.isInteger(orderNum) || orderNum < 1) {
      setFormError("Order must be a positive integer.");
      return;
    }

    const isDuplicateOrder = lessons.some(
      (l) => l.order === orderNum && l.id !== editingId,
    );
    if (isDuplicateOrder) {
      const conflict = lessons.find((l) => l.order === orderNum);
      setFormError(
        `Order ${orderNum} is already used by "${conflict?.title}". Choose a different position.`,
      );
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const body: CreateLessonInput = {
          title: form.title.trim(),
          content: form.content.trim(),
          order: orderNum,
        };
        await createLesson(token, courseId, body);
      } else if (editingId !== null) {
        const body: UpdateLessonInput = {
          title: form.title.trim(),
          content: form.content.trim(),
          order: orderNum,
        };
        await updateLesson(token, courseId, String(editingId), body);
      }
      setFormModalOpen(false);
      refreshList();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onConfirmDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    setDeleteError(null);

    const token = await getToken();
    if (!token) {
      setDeleteError("You must be signed in.");
      return;
    }

    setDeleting(true);
    try {
      await deleteLesson(token, courseId, String(deleteTarget.id));
      setDeleteTarget(null);
      refreshList();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          Manage all lessons for this course. Learners see them in order.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
        >
          + New lesson
        </button>
      </div>

      {lessons.length === 0 && (
        <p className="text-sm text-stone-500 border border-dashed border-stone-200 rounded-2xl px-5 py-8 text-center">
          No lessons yet. Use <strong>New lesson</strong> to add the first one.
        </p>
      )}

      <ul className="space-y-3">
        {lessons.map((l, index) => (
          <li
            key={l.id}
            className={mounted ? "flow-row-in" : "opacity-0"}
            style={
              mounted
                ? ({ animationDelay: `${0.06 * index}s` } as CSSProperties)
                : undefined
            }
          >
            <Link href={`/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(l.id)}`}>
              <div
                className={`${FLOW_LIST_ROW_CLASS} flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-5">
                  <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600 mt-0.5">
                    {String(l.order).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-stone-900 transition-colors group-hover:text-emerald-700">
                      {l.title}
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm text-stone-500 leading-relaxed whitespace-pre-line">
                      {l.content}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(l); }}
                    disabled={deleting}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteModal(l); }}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <LessonFormModal
        open={formModalOpen}
        onCloseAction={closeFormModal}
        mode={mode}
        form={form}
        setFormAction={setForm}
        onSubmitAction={onSubmitForm}
        saving={saving}
        error={formError}
      />

      <DeleteLessonModal
        open={deleteTarget !== null}
        lessonTitle={deleteTarget?.title ?? ""}
        onCloseAction={closeDeleteModal}
        onConfirmAction={onConfirmDelete}
        deleting={deleting}
        error={deleteError}
      />
    </div>
  );
}
