import TaskItem from './TaskItem';
import type { Task, TaskAction } from '../types';

interface TaskListProps {
  tasks: Task[];
  notice: { message: string; isError: boolean } | null;
  emptyMessage: string;
  onEdit: (taskId: string) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  notice,
  emptyMessage,
  onEdit,
  onToggle,
  onDelete,
}: TaskListProps) {
  function handleAction(action: TaskAction, taskId: string): void {
    if (action === 'edit') {
      onEdit(taskId);
    } else if (action === 'toggle') {
      onToggle(taskId);
    } else {
      onDelete(taskId);
    }
  }

  return (
    <section className="task-list-section" aria-labelledby="list-title">
      <div className="task-list-heading">
        <h2 className="app-kicker" id="list-title">
          Tugas saya
        </h2>
        <span className="task-count">{tasks.length} tugas</span>
      </div>

      <p
        className="app-notice"
        role={notice?.isError ? 'alert' : 'status'}
        aria-live={notice?.isError ? 'assertive' : 'polite'}
      >
        {notice?.message ?? ''}
      </p>

      {tasks.length === 0 ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <ul className="task-list" aria-label="Daftar tugas kuliah">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onAction={handleAction} />
          ))}
        </ul>
      )}
    </section>
  );
}
