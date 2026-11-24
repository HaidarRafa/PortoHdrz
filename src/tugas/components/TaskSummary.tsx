import type { Task } from '../types';

interface TaskSummaryProps {
  tasks: Task[];
}

export default function TaskSummary({ tasks }: TaskSummaryProps) {
  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  return (
    <p className="task-summary" role="status" aria-live="polite">
      {remainingCount} BELUM SELESAI | {completedCount} SELESAI
    </p>
  );
}
