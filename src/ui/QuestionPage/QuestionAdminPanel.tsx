"use client";

import { useAuth } from "@clerk/nextjs";
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
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/src/services/question";
import type { CreateQuestionInput, Question, UpdateQuestionInput } from "@/src/types";
import {
  emptyQuestionForm,
  questionToFormState,
  QuestionFormModal,
  type QuestionFormMode,
  type QuestionFormState,
} from "@/src/ui/QuestionPage/QuestionFormModal";
import { DeleteQuestionModal } from "@/src/ui/QuestionPage/DeleteQuestionModal";

type Props = {
  readonly lessonId: number;
  readonly initialQuestions: readonly Question[];
};

export function QuestionAdminPanel({
  lessonId,
  initialQuestions,
}: Props): ReactElement {
  const { getToken } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([...initialQuestions]);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [mode, setMode] = useState<QuestionFormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QuestionFormState>(emptyQuestionForm());

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    question: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setQuestions([...initialQuestions]);
  }, [initialQuestions]);

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
    setForm(emptyQuestionForm());
    setFormModalOpen(true);
  };

  const openEdit = (q: Question): void => {
    setFormError(null);
    setMode("edit");
    setEditingId(q.id);
    setForm(questionToFormState(q));
    setFormModalOpen(true);
  };

  const closeFormModal = (): void => {
    if (!saving) {
      setFormModalOpen(false);
      setFormError(null);
    }
  };

  const openDeleteModal = (q: Question): void => {
    setDeleteError(null);
    setDeleteTarget({ id: q.id, question: q.question });
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

    const trimmedOptions = form.options.map((o) => o.trim()).filter(Boolean);
    if (trimmedOptions.length < 2) {
      setFormError("At least 2 non-empty options are required.");
      return;
    }

    if (!form.correctAnswer.trim()) {
      setFormError("Please select a correct answer.");
      return;
    }

    if (!trimmedOptions.includes(form.correctAnswer.trim())) {
      setFormError("The correct answer must match one of the options.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const body: CreateQuestionInput = {
          question: form.question.trim(),
          options: trimmedOptions,
          correctAnswer: form.correctAnswer.trim(),
        };
        await createQuestion(token, lessonId, body);
      } else if (editingId !== null) {
        const body: UpdateQuestionInput = {
          question: form.question.trim(),
          options: trimmedOptions,
          correctAnswer: form.correctAnswer.trim(),
        };
        await updateQuestion(token, lessonId, editingId, body);
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
      await deleteQuestion(token, lessonId, deleteTarget.id);
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
          Manage all questions for this lesson. Learners see them during exercises.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
        >
          + New question
        </button>
      </div>

      {questions.length === 0 && (
        <p className="text-sm text-stone-500 border border-dashed border-stone-200 rounded-2xl px-5 py-8 text-center">
          No questions yet. Use <strong>New question</strong> to add the first one.
        </p>
      )}

      <ul className="space-y-3">
        {questions.map((q, index) => (
          <li
            key={q.id}
            className={mounted ? "flow-row-in" : "opacity-0"}
            style={
              mounted
                ? ({ animationDelay: `${0.06 * index}s` } as CSSProperties)
                : undefined
            }
          >
            <div
              className={`${FLOW_LIST_ROW_CLASS} flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between cursor-default`}
              role="button"
              tabIndex={0}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <p className="text-base font-bold text-stone-900 transition-colors group-hover:text-emerald-700">
                  {q.question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const isCorrect = opt === q.correctAnswer;
                    return (
                      <span
                        key={opt}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {isCorrect && (
                          <span className="text-emerald-600">✓</span>
                        )}
                        {opt}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div
                className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openEdit(q); }}
                  disabled={deleting}
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={(e) => { e.stopPropagation(); openDeleteModal(q); }}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <QuestionFormModal
        open={formModalOpen}
        onCloseAction={closeFormModal}
        mode={mode}
        form={form}
        setFormAction={setForm}
        onSubmitAction={onSubmitForm}
        saving={saving}
        error={formError}
      />

      <DeleteQuestionModal
        open={deleteTarget !== null}
        questionText={deleteTarget?.question ?? ""}
        onCloseAction={closeDeleteModal}
        onConfirmAction={onConfirmDelete}
        deleting={deleting}
        error={deleteError}
      />
    </div>
  );
}
