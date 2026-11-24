import './tugas.css';

interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  completed: boolean;
}

type TaskAction = 'toggle' | 'edit' | 'delete';

const storageKey = 'haidar-portfolio-course-tasks-v1';
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const taskForm = document.querySelector<HTMLFormElement>('#task-form');
const formTitle = document.querySelector<HTMLInputElement>('#task-title');
const formCourse = document.querySelector<HTMLInputElement>('#task-course');
const formDueDate = document.querySelector<HTMLInputElement>('#task-due-date');
const formHeading = document.querySelector<HTMLHeadingElement>('#form-title');
const submitButton = document.querySelector<HTMLButtonElement>('#submit-task');
const cancelEditButton = document.querySelector<HTMLButtonElement>('#cancel-edit');
const taskList = document.querySelector<HTMLUListElement>('#task-list');
const emptyState = document.querySelector<HTMLParagraphElement>('#empty-state');
const taskSummary = document.querySelector<HTMLParagraphElement>('#task-summary');
const taskCount = document.querySelector<HTMLSpanElement>('#task-count');
const appNotice = document.querySelector<HTMLParagraphElement>('#app-notice');
const yearElement = document.querySelector<HTMLElement>('#current-year');

if (
  !taskForm ||
  !formTitle ||
  !formCourse ||
  !formDueDate ||
  !formHeading ||
  !submitButton ||
  !cancelEditButton ||
  !taskList ||
  !emptyState ||
  !taskSummary ||
  !taskCount ||
  !appNotice ||
  !yearElement
) {
  throw new Error('Elemen aplikasi tugas yang dibutuhkan tidak ditemukan.');
}

const form = taskForm;
const titleInput = formTitle;
const courseInput = formCourse;
const dueDateInput = formDueDate;
const heading = formHeading;
const saveButton = submitButton;
const discardEditButton = cancelEditButton;
const list = taskList;
const emptyMessage = emptyState;
const summary = taskSummary;
const countLabel = taskCount;
const notice = appNotice;

let tasks: Task[] = [];
let editingTaskId: string | null = null;

function isValidDueDate(value: string): boolean {
  if (value === '') {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
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

function readTasks(): Task[] {
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

function saveTasks(nextTasks: Task[]): boolean {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(nextTasks));
  } catch {
    showNotice('Perubahan tidak tersimpan. Periksa ruang penyimpanan browser.', true);
    return false;
  }

  tasks = nextTasks;
  renderTasks();
  return true;
}

function showNotice(message: string, isError = false): void {
  notice.textContent = message;
  notice.setAttribute('role', isError ? 'alert' : 'status');
  notice.setAttribute('aria-live', isError ? 'assertive' : 'polite');
}

function createTaskItem(task: Task): HTMLLIElement {
  const item = document.createElement('li');
  item.className = `task-item${task.completed ? ' is-completed' : ''}`;

  const headingRow = document.createElement('div');
  headingRow.className = 'task-item-heading';

  const statusLabel = document.createElement('span');
  statusLabel.className = 'task-status-label';
  statusLabel.textContent = task.completed ? 'Selesai' : 'Belum Selesai';
  headingRow.append(statusLabel);

  const courseLabel = document.createElement('p');
  courseLabel.className = 'task-course';
  courseLabel.textContent = task.course;
  headingRow.append(courseLabel);
  item.append(headingRow);

  const title = document.createElement('h3');
  title.className = 'task-title';
  title.textContent = task.title;
  item.append(title);

  if (task.dueDate !== '') {
    const dueDate = document.createElement('p');
    dueDate.className = 'task-due-date';
    const dateTime = document.createElement('time');
    dateTime.dateTime = task.dueDate;
    dateTime.textContent = `Tenggat: ${dateFormatter.format(
      new Date(`${task.dueDate}T00:00:00`),
    )}`;
    dueDate.append(dateTime);
    item.append(dueDate);
  }

  const actions = document.createElement('div');
  actions.className = 'task-actions';
  actions.append(
    createActionButton(
      task.completed ? 'Tandai belum selesai' : 'Tandai selesai',
      'toggle',
      task.id,
      'button button-secondary',
      task.completed,
    ),
    createActionButton('Edit', 'edit', task.id, 'button button-secondary'),
    createActionButton('Hapus', 'delete', task.id, 'button button-danger'),
  );
  item.append(actions);
  return item;
}

function createActionButton(
  label: string,
  action: TaskAction,
  taskId: string,
  className: string,
  isPressed?: boolean,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.taskId = taskId;
  if (action === 'toggle' && isPressed !== undefined) {
    button.setAttribute('aria-pressed', String(isPressed));
  }
  return button;
}

function renderTasks(): void {
  list.replaceChildren(...tasks.map(createTaskItem));
  emptyMessage.hidden = tasks.length > 0;

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;
  countLabel.textContent = `${tasks.length} tugas`;
  summary.textContent = `${remainingCount} belum selesai · ${completedCount} selesai`;
}

function resetForm(): void {
  form.reset();
  editingTaskId = null;
  heading.textContent = 'Tambah tugas';
  saveButton.textContent = 'Tambahkan tugas';
  discardEditButton.hidden = true;
}

function startEditing(task: Task): void {
  editingTaskId = task.id;
  titleInput.value = task.title;
  courseInput.value = task.course;
  dueDateInput.value = task.dueDate;
  heading.textContent = 'Edit tugas';
  saveButton.textContent = 'Simpan perubahan';
  discardEditButton.hidden = false;
  titleInput.focus();
}

function handleTaskAction(action: TaskAction, taskId: string): void {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) {
    showNotice('Tugas yang dipilih tidak ditemukan. Muat ulang halaman.', true);
    return;
  }

  if (action === 'edit') {
    startEditing(task);
    return;
  }

  if (action === 'delete') {
    if (!window.confirm(`Hapus tugas "${task.title}"?`)) {
      return;
    }

    const nextTasks = tasks.filter((item) => item.id !== taskId);
    if (saveTasks(nextTasks)) {
      if (editingTaskId === taskId) {
        resetForm();
      }
      showNotice('Tugas berhasil dihapus.');
    }
    return;
  }

  const nextTasks = tasks.map((item) =>
    item.id === taskId ? { ...item, completed: !item.completed } : item,
  );
  if (saveTasks(nextTasks)) {
    showNotice(task.completed ? 'Tugas ditandai belum selesai.' : 'Tugas ditandai selesai.');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const course = courseInput.value.trim();
  const dueDate = dueDateInput.value;

  if (title === '' || course === '') {
    showNotice('Isi nama tugas dan mata kuliah terlebih dahulu.', true);
    return;
  }

  if (!isValidDueDate(dueDate)) {
    showNotice('Tanggal tenggat tidak valid.', true);
    return;
  }

  const taskToEdit = editingTaskId;
  const nextTasks =
    taskToEdit === null
      ? [{ id: crypto.randomUUID(), title, course, dueDate, completed: false }, ...tasks]
      : tasks.map((task) =>
          task.id === taskToEdit
            ? { ...task, title, course, dueDate }
            : task,
        );

  if (saveTasks(nextTasks)) {
    resetForm();
    showNotice(taskToEdit === null ? 'Tugas berhasil ditambahkan.' : 'Perubahan tugas berhasil disimpan.');
    titleInput.focus();
  }
});

list.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest<HTMLButtonElement>('button[data-action][data-task-id]');
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const taskId = button.dataset.taskId;
  if (
    (action === 'toggle' || action === 'edit' || action === 'delete') &&
    taskId
  ) {
    handleTaskAction(action, taskId);
  }
});

discardEditButton.addEventListener('click', () => {
  resetForm();
  showNotice('Edit tugas dibatalkan.');
});

yearElement.textContent = String(new Date().getFullYear());

try {
  tasks = readTasks();
  renderTasks();
} catch (error) {
  form.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button').forEach((control) => {
    control.disabled = true;
  });
  emptyMessage.hidden = true;
  summary.textContent = 'Data tugas tidak tersedia.';
  showNotice(
    error instanceof Error ? error.message : 'Tugas gagal dimuat dari penyimpanan browser.',
    true,
  );
}
