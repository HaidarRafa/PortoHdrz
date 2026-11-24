import { useEffect, useState, type FormEvent } from 'react';
import { isValidDueDate } from '../storage';
import type { Task, TaskFormValues } from '../types';

interface TaskFormProps {
  editingTask: Task | null;
  disabled: boolean;
  onSubmit: (values: TaskFormValues) => boolean;
  onCancel: () => void;
}

export default function TaskForm({
  editingTask,
  disabled,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setTitle(editingTask?.title ?? '');
    setCourse(editingTask?.course ?? '');
    setDueDate(editingTask?.dueDate ?? '');
    setValidationMessage('');
  }, [
    editingTask?.id,
    editingTask?.title,
    editingTask?.course,
    editingTask?.dueDate,
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedCourse = course.trim();
    if (trimmedTitle === '' || trimmedCourse === '') {
      setValidationMessage('Isi judul tugas dan mata kuliah terlebih dahulu.');
      return;
    }

    if (!isValidDueDate(dueDate)) {
      setValidationMessage('Tanggal tenggat tidak valid.');
      return;
    }

    setValidationMessage('');
    const saved = onSubmit({
      title: trimmedTitle,
      course: trimmedCourse,
      dueDate,
    });

    if (saved && editingTask === null) {
      setTitle('');
      setCourse('');
      setDueDate('');
    }
  }

  return (
    <section className="task-form-card" aria-labelledby="form-title">
      <h2 className="app-kicker" id="form-title">
        Kelola tugas
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="form-field" htmlFor="task-title">
          <span>
            JUDUL TUGAS <span className="required-mark" aria-hidden="true">*</span>
          </span>
          <input
            id="task-title"
            name="title"
            type="text"
            maxLength={120}
            autoComplete="off"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            required
            disabled={disabled}
          />
        </label>
        <label className="form-field" htmlFor="task-course">
          <span>
            MATA KULIAH{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
          </span>
          <input
            id="task-course"
            name="course"
            type="text"
            maxLength={80}
            autoComplete="off"
            value={course}
            onChange={(event) => setCourse(event.currentTarget.value)}
            required
            disabled={disabled}
          />
        </label>
        <label className="form-field" htmlFor="task-due-date">
          <span>
            TENGGAT
          </span>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.currentTarget.value)}
            disabled={disabled}
          />
        </label>
        {validationMessage !== '' && (
          <p className="form-note" role="alert">
            {validationMessage}
          </p>
        )}
        <div className="form-actions">
          <button
            className="button button-primary"
            type="submit"
            disabled={disabled}
          >
            {editingTask === null ? 'TAMBAHKAN TUGAS' : 'SIMPAN PERUBAHAN'}
          </button>
          {editingTask !== null && (
            <button
              className="button button-secondary"
              type="button"
              onClick={onCancel}
            >
              Batalkan
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
