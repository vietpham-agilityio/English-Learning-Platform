'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactElement,
} from 'react';

import { courseRowIcon } from '@/src/constants/content';
import { COURSE_STATUS } from '@/src/constants/enum';
import { FLOW_LIST_ROW_CLASS } from '@/src/constants/styles';
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from '@/src/services/course';
import type { Course, CreateCourseInput, UpdateCourseInput } from '@/src/types';
import {
  CourseFormModal,
  courseToFormState,
  emptyCourseForm,
  type CourseFormMode,
  type CourseFormState,
} from '@/src/ui/CoursePage/CourseFormModal';
import { DeleteCourseModal } from '@/src/ui/CoursePage/DeleteCourseModal';
import { formatUsdDollars } from '@/src/utils/format';

type Props = {
  readonly initialCourses: readonly Course[];
};

export function CourseAdminPanel({ initialCourses }: Props): ReactElement {
  const { getToken } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([...initialCourses]);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [mode, setMode] = useState<CourseFormMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormState>(emptyCourseForm);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setCourses([...initialCourses]);
  }, [initialCourses]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const refreshList = useCallback((): void => {
    router.refresh();
  }, [router]);

  const openCreate = (): void => {
    setFormError(null);
    setMode('create');
    setEditingId(null);
    setForm(emptyCourseForm());
    setFormModalOpen(true);
  };

  const openEdit = (c: Course): void => {
    setFormError(null);
    setMode('edit');
    setEditingId(c.id);
    setForm(courseToFormState(c));
    setFormModalOpen(true);
  };

  const closeFormModal = (): void => {
    if (!saving) {
      setFormModalOpen(false);
      setFormError(null);
    }
  };

  const openDeleteModal = (c: Course): void => {
    setDeleteError(null);
    setDeleteTarget({ id: c.id, title: c.title });
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
      setFormError('You must be signed in.');
      return;
    }

    const priceNum = form.isFree ? 0 : Number(form.price);
    if (!form.isFree && (Number.isNaN(priceNum) || priceNum < 0)) {
      setFormError('Price must be a non-negative number.');
      return;
    }

    setSaving(true);
    try {
      if (mode === 'create') {
        const body: CreateCourseInput = {
          title: form.title.trim(),
          description: form.description.trim(),
          price: priceNum,
          isFree: form.isFree,
          status: form.status,
        };
        await createCourse(token, body);
      } else if (editingId) {
        const body: UpdateCourseInput = {
          title: form.title.trim(),
          description: form.description.trim(),
          price: priceNum,
          isFree: form.isFree,
          status: form.status,
        };
        await updateCourse(token, editingId, body);
      }
      setFormModalOpen(false);
      refreshList();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onConfirmDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    setDeleteError(null);
    const token = await getToken();
    if (!token) {
      setDeleteError('You must be signed in.');
      return;
    }

    setDeleting(true);
    try {
      await deleteCourse(token, deleteTarget.id);
      setDeleteTarget(null);
      refreshList();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          Manage all courses (including unpublished). Learners only see
          published items in the catalog.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
        >
          + New course
        </button>
      </div>

      {courses.length === 0 && (
        <p className="text-sm text-stone-500 border border-dashed border-stone-200 rounded-2xl px-5 py-8 text-center">
          No courses yet. Use <strong>New course</strong> to add one.
        </p>
      )}

      <ul className="space-y-3">
        {courses.map((c, index) => {
          const icon = courseRowIcon(c.title, c.id);
          const priceLabel = c.isFree ? 'Free' : formatUsdDollars(c.price);
          return (
            <li
              key={c.id}
              className={mounted ? 'flow-row-in' : 'opacity-0'}
              style={
                mounted
                  ? ({ animationDelay: `${0.08 * index}s` } as CSSProperties)
                  : undefined
              }
            >
              <Link href={`/courses/${encodeURIComponent(c.id)}`}>
                <div
                  className={`${FLOW_LIST_ROW_CLASS} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-5">
                    <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="shrink-0 text-2xl" aria-hidden>
                      {icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-bold text-stone-900 transition-colors group-hover:text-emerald-700">
                          {c.title}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                            c.status === COURSE_STATUS.PUBLISHED
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {c.status}
                        </span>
                        <span
                          className={`text-xs font-semibold tabular-nums ${
                            c.isFree ? 'text-emerald-700' : 'text-stone-500'
                          }`}
                        >
                          {priceLabel}
                        </span>
                      </div>
                      <p
                        className="mt-0.5 line-clamp-2 text-sm text-stone-500"
                        title={c.description}
                      >
                        {c.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(c); }}
                      disabled={deleting}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteModal(c); }}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <CourseFormModal
        open={formModalOpen}
        onClose={closeFormModal}
        mode={mode}
        form={form}
        setForm={setForm}
        onSubmit={onSubmitForm}
        saving={saving}
        error={formError}
      />

      <DeleteCourseModal
        open={deleteTarget !== null}
        courseTitle={deleteTarget?.title ?? ''}
        onClose={closeDeleteModal}
        onConfirm={onConfirmDelete}
        deleting={deleting}
        error={deleteError}
      />
    </div>
  );
}
