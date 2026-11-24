import type { Task, TaskAction } from '../types';

interface TaskItemProps {
  task: Task;
  onAction: (action: TaskAction, taskId: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function TaskItem({ task, onAction }: TaskItemProps) {
  return (
    <li className={`task-item${task.completed ? ' is-completed' : ''}`}>
      <div className="task-item-heading">
        <span className="task-status-label">
          {task.completed ? 'Selesai' : 'Belum Selesai'}
        </span>
        <p className="task-course">{task.course}</p>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.dueDate !== '' && (
        <p className="task-due-date">
          <time dateTime={task.dueDate}>
            Tenggat:{' '}
            {dateFormatter.format(new Date(`${task.dueDate}T00:00:00`))}
          </time>
        </p>
      )}

      <div className="task-actions">
        <button
          className="button button-secondary"
          type="button"
          aria-pressed={task.completed}
          onClick={() => onAction('toggle', task.id)}
        >
          {task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
        </button>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => onAction('edit', task.id)}
        >
          Edit
        </button>
        <button
          className="button button-danger"
          type="button"
          onClick={() => onAction('delete', task.id)}
        >
          Hapus
        </button>
      </div>
    </li>
  );
}
