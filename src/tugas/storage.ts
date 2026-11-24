import type { Task } from './types';

const storageKey = 'haidar-portfolio-course-tasks-v1';

export function isValidDueDate(value: string): boolean {
  if (value === '') {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value
  );
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0 &&
    typeof task.course === 'string' &&
    task.course.trim().length > 0 &&
    typeof task.dueDate === 'string' &&
    isValidDueDate(task.dueDate) &&
    typeof task.completed === 'boolean'
  );
}

export function readTasks(): Task[] {
  const storedTasks = window.localStorage.getItem(storageKey);
  if (storedTasks === null) {
    return [];
  }

  let parsedTasks: unknown;
  try {
    parsedTasks = JSON.parse(storedTasks);
  } catch {
    throw new Error('Data tugas tersimpan tidak dapat dibaca karena formatnya rusak.');
  }

  if (!Array.isArray(parsedTasks) || !parsedTasks.every(isTask)) {
    throw new Error('Data tugas tersimpan tidak valid dan tidak dapat ditampilkan.');
  }

  return parsedTasks;
}

export function writeTasks(tasks: Task[]): void {
  window.localStorage.setItem(storageKey, JSON.stringify(tasks));
}
