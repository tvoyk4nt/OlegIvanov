const taskForm = document.querySelector('#task-form');
const taskTitle = document.querySelector('#task-title');
const taskList = document.querySelector('#task-list');
const taskFilter = document.querySelector('#task-filter');
const taskCount = document.querySelector('#task-count');
const activeCount = document.querySelector('#active-count');
const titleError = document.querySelector('#title-error');
const clearCompletedButton = document.querySelector('#clear-completed');

let tasks = [];
let nextId = Date.now();

try {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getFilteredTasks() {
    if (taskFilter.value === 'active') {
        return tasks.filter(task => !task.completed);
    }

    if (taskFilter.value === 'completed') {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = getFilteredTasks();

    taskCount.textContent = 'Всего задач: ' + tasks.length;
    activeCount.textContent = 'Активных: ' + tasks.filter(task => !task.completed).length;

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.classList.add('empty-message');

        if (tasks.length === 0) {
            emptyMessage.textContent = 'Пока нет задач. Добавь первую!';
        } else {
            emptyMessage.textContent = 'В этом списке задач нет.';
        }

        taskList.append(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const item = document.createElement('li');
        item.classList.add('task');
        item.dataset.taskId = task.id;

        if (task.completed) {
            item.classList.add('task--completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task__toggle');
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Отметить выполнение');
        checkbox.dataset.action = 'toggle';

        const title = document.createElement('span');
        title.classList.add('task__title');
        title.textContent = task.title;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.classList.add('task__delete');
        deleteButton.dataset.action = 'delete';
        deleteButton.textContent = 'Удалить';

        item.append(checkbox, title, deleteButton);
        taskList.append(item);
    });
}

function addTask(title) {
    tasks.push({
        id: nextId++,
        title,
        completed: false
    });

    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

taskForm.addEventListener('submit', event => {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (title.length < 3) {
        titleError.textContent = 'Введите название длиной не менее 3 символов.';
        taskTitle.setAttribute('aria-invalid', 'true');
        taskTitle.focus();
        return;
    }

    titleError.textContent = '';
    taskTitle.removeAttribute('aria-invalid');

    addTask(title);
    taskForm.reset();
    taskTitle.focus();
});

taskTitle.addEventListener('input', () => {
    titleError.textContent = '';
    taskTitle.removeAttribute('aria-invalid');
});

taskList.addEventListener('click', event => {
    const actionElement = event.target.closest('[data-action]');

    if (!actionElement || !taskList.contains(actionElement)) {
        return;
    }

    const taskElement = actionElement.closest('[data-task-id]');
    if (!taskElement) {
        return;
    }

    const taskId = Number(taskElement.dataset.taskId);

    if (actionElement.dataset.action === 'delete') {
        deleteTask(taskId);
    }

    if (actionElement.dataset.action === 'toggle') {
        toggleTask(taskId);
    }
});

taskFilter.addEventListener('change', renderTasks);

clearCompletedButton.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();