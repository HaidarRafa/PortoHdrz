export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  completed: boolean;
}

export interface TaskFormValues {
  title: string;
  course: string;
  dueDate: string;
}

export type TaskAction = 'toggle' | 'edit' | 'delete';
