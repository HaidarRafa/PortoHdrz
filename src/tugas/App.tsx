import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskSummary from './components/TaskSummary';
import { readTasks, writeTasks } from './storage';
import type { Task, TaskFormValues } from './types';

interface AppNotice {
  message: string;
  isError: boolean;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [notice, setNotice] = useState<AppNotice | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setTasks(readTasks());
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Tugas gagal dimuat dari penyimpanan browser.',
      );
      setLoadError(message);
      setNotice({ message, isError: true });
    }
  }, []);

  const editingTask =
    tasks.find((task) => task.id === editingTaskId) ?? null;

  function saveTasks(nextTasks: Task[]): boolean {
    try {
      writeTasks(nextTasks);
    } catch {
      setNotice({
        message: 'Perubahan tidak tersimpan. Periksa ruang penyimpanan browser.',
        isError: true,
      });
      return false;
    }

    setTasks(nextTasks);
    return true;
  }

  function handleSubmit(values: TaskFormValues): boolean {
    const taskToEdit = editingTaskId;
    const nextTasks =
      taskToEdit === null
        ? [
            {
              id: crypto.randomUUID(),
              ...values,
              completed: false,
            },
            ...tasks,
          ]
        : tasks.map((task) =>
            task.id === taskToEdit ? { ...task, ...values } : task,
          );

    if (!saveTasks(nextTasks)) {
      return false;
    }

    setEditingTaskId(null);
    setNotice({
      message:
        taskToEdit === null
          ? 'Tugas berhasil ditambahkan.'
          : 'Perubahan tugas berhasil disimpan.',
      isError: false,
    });
    return true;
  }

  function handleToggle(taskId: string): void {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (!selectedTask) {
      setNotice({
        message: 'Tugas yang dipilih tidak ditemukan. Muat ulang halaman.',
        isError: true,
      });
      return;
    }

    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    if (saveTasks(nextTasks)) {
      setNotice({
        message: selectedTask.completed
          ? 'Tugas ditandai belum selesai.'
          : 'Tugas ditandai selesai.',
        isError: false,
      });
    }
  }

  function handleDelete(taskId: string): void {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (!selectedTask) {
      setNotice({
        message: 'Tugas yang dipilih tidak ditemukan. Muat ulang halaman.',
        isError: true,
      });
      return;
    }

    if (!window.confirm(`Hapus tugas "${selectedTask.title}"?`)) {
      return;
    }

    const nextTasks = tasks.filter((task) => task.id !== taskId);
    if (saveTasks(nextTasks)) {
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
      }
      setNotice({ message: 'Tugas berhasil dihapus.', isError: false });
    }
  }

  function handleCancelEdit(): void {
    setEditingTaskId(null);
    setNotice({ message: 'Edit tugas dibatalkan.', isError: false });
  }

  return (
    <>
      <header className="app-header">
        <nav className="app-navigation" aria-label="Navigasi aplikasi">
          <a className="app-wordmark" href="./index.html">
            Hdrz
          </a>
          <a className="back-link" href="./index.html#proyek">
            <span aria-hidden="true"></span> Kembali ke Portofolio
          </a>
        </nav>
      </header>

      <main className="app-main">
        <section className="app-intro" aria-labelledby="page-title">
          <h1 id="page-title">
            Daftar Tugas <span>Kuliah.</span>
          </h1>
          <p className="app-description">
            Catat tugas, pantau tenggat, dan tandai pekerjaan yang sudah selesai.
          </p>
          <TaskSummary tasks={tasks} />
        </section>

        <div className="app-layout">
          <TaskForm
            editingTask={editingTask}
            disabled={loadError !== null}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />

          <TaskList
            tasks={tasks}
            notice={notice}
            emptyMessage={
              loadError === null ? 'Belum ada tugas.' : 'Data tugas tidak tersedia.'
            }
            onEdit={setEditingTaskId}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Haidar Rafa Radinka</p>
      </footer>
    </>
  );
}
