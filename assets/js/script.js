(() => {
  "use strict";

  const STORAGE_KEY = "taskinator.tasks";
  const LEGACY_STORAGE_KEY = "tasks";
  const MAX_TASK_NAME_LENGTH = 80;

  const TASK_STATUSES = Object.freeze({
    TODO: "to do",
    IN_PROGRESS: "in progress",
    COMPLETED: "completed",
  });

  const STATUS_LABELS = Object.freeze({
    [TASK_STATUSES.TODO]: "To Do",
    [TASK_STATUSES.IN_PROGRESS]: "In Progress",
    [TASK_STATUSES.COMPLETED]: "Completed",
  });

  const TASK_TYPES = Object.freeze(["Print", "Web", "Mobile"]);
  const STATUS_VALUES = Object.values(TASK_STATUSES);

  const selectors = Object.freeze({
    form: "#task-form",
    taskNameInput: "#task-name",
    taskTypeInput: "#task-type",
    saveTaskButton: "#save-task",
    pageContent: "#page-content",
    statusMessage: "#status-message",
    taskLists: {
      [TASK_STATUSES.TODO]: "#tasks-to-do",
      [TASK_STATUSES.IN_PROGRESS]: "#tasks-in-progress",
      [TASK_STATUSES.COMPLETED]: "#tasks-completed",
    },
  });

  const state = {
    tasks: [],
    nextTaskId: 1,
  };

  const getElement = (selector, root = document) => root.querySelector(selector);

  const elements = {
    form: getElement(selectors.form),
    taskNameInput: getElement(selectors.taskNameInput),
    taskTypeInput: getElement(selectors.taskTypeInput),
    saveTaskButton: getElement(selectors.saveTaskButton),
    pageContent: getElement(selectors.pageContent),
    statusMessage: getElement(selectors.statusMessage),
    taskLists: {},
  };

  Object.entries(selectors.taskLists).forEach(([status, selector]) => {
    elements.taskLists[status] = getElement(selector);
  });

  const setStatusMessage = (message) => {
    if (elements.statusMessage) {
      elements.statusMessage.textContent = message;
    }
  };

  const normalizeStatus = (value) => {
    const normalizedValue = String(value || "").trim().toLowerCase();
    return STATUS_VALUES.includes(normalizedValue) ? normalizedValue : TASK_STATUSES.TODO;
  };

  const normalizeTaskType = (value) => {
    const normalizedValue = String(value || "").trim();
    return TASK_TYPES.includes(normalizedValue) ? normalizedValue : "";
  };

  const normalizeTaskName = (value) => String(value || "").trim().slice(0, MAX_TASK_NAME_LENGTH);

  const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

  const sanitizeTask = (task, fallbackId) => {
    if (!isPlainObject(task)) {
      return null;
    }

    const name = normalizeTaskName(task.name);
    const type = normalizeTaskType(task.type);

    if (!name || !type) {
      return null;
    }

    const parsedId = Number.parseInt(task.id, 10);
    const id = Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : fallbackId;

    return {
      id,
      name,
      type,
      status: normalizeStatus(task.status),
    };
  };

  const readStoredTasks = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    } catch (error) {
      console.warn("Taskinator could not access localStorage. Starting with an empty board.", error);
      setStatusMessage("Taskinator could not access browser storage, so changes may not persist.");
      return null;
    }
  };

  const readTasksFromStorage = () => {
    const storedTasks = readStoredTasks();

    if (!storedTasks) {
      return [];
    }

    try {
      const parsedTasks = JSON.parse(storedTasks);

      if (!Array.isArray(parsedTasks)) {
        throw new TypeError("Stored tasks are not an array.");
      }

      const seenIds = new Set();
      const sanitizedTasks = [];

      parsedTasks.forEach((task, index) => {
        const sanitizedTask = sanitizeTask(task, index + 1);

        if (!sanitizedTask) {
          return;
        }

        while (seenIds.has(sanitizedTask.id)) {
          sanitizedTask.id += 1;
        }

        seenIds.add(sanitizedTask.id);
        sanitizedTasks.push(sanitizedTask);
      });

      return sanitizedTasks;
    } catch (error) {
      console.warn("Taskinator could not parse saved tasks. Starting with an empty board.", error);
      setStatusMessage("Saved task data could not be loaded, so Taskinator started with an empty board.");
      return [];
    }
  };

  const saveTasks = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn("Taskinator could not save tasks to localStorage.", error);
      setStatusMessage("Taskinator could not save tasks to browser storage.");
      return false;
    }
  };

  const getTaskById = (taskId) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    return state.tasks.find((task) => task.id === parsedTaskId);
  };

  const createElement = (tagName, options = {}) => {
    const element = document.createElement(tagName);

    if (options.className) {
      element.className = options.className;
    }

    if (options.text !== undefined) {
      element.textContent = options.text;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([name, value]) => {
        element.setAttribute(name, value);
      });
    }

    return element;
  };

  const createButton = ({ text, className, taskId }) =>
    createElement("button", {
      text,
      className: `btn ${className}`,
      attributes: {
        type: "button",
        "data-task-id": taskId,
        "aria-label": `${text} task`,
      },
    });

  const createStatusSelect = (task) => {
    const selectElement = createElement("select", {
      className: "select-status",
      attributes: {
        name: "status-change",
        "data-task-id": task.id,
        "aria-label": `Change status for ${task.name}`,
      },
    });

    STATUS_VALUES.forEach((status) => {
      const optionElement = createElement("option", {
        text: STATUS_LABELS[status],
        attributes: { value: status },
      });
      selectElement.appendChild(optionElement);
    });

    selectElement.value = task.status;
    return selectElement;
  };

  const createTaskElement = (task) => {
    const listItemElement = createElement("li", {
      className: "task-item",
      attributes: { "data-task-id": task.id },
    });

    const taskInfoElement = createElement("div", { className: "task-info" });
    taskInfoElement.append(
      createElement("h3", { className: "task-name", text: task.name }),
      createElement("span", { className: "task-type", text: task.type })
    );

    const taskActionsElement = createElement("div", { className: "task-actions" });
    taskActionsElement.append(
      createButton({ text: "Edit", className: "edit-btn", taskId: task.id }),
      createButton({ text: "Delete", className: "delete-btn", taskId: task.id }),
      createStatusSelect(task)
    );

    listItemElement.append(taskInfoElement, taskActionsElement);
    return listItemElement;
  };

  const clearTaskLists = () => {
    Object.values(elements.taskLists).forEach((taskListElement) => {
      taskListElement.replaceChildren();
    });
  };

  const renderTasks = () => {
    clearTaskLists();

    state.tasks.forEach((task) => {
      const taskListElement = elements.taskLists[task.status] || elements.taskLists[TASK_STATUSES.TODO];
      taskListElement.appendChild(createTaskElement(task));
    });
  };

  const resetTaskForm = () => {
    elements.form.reset();
    elements.form.removeAttribute("data-task-id");
    elements.saveTaskButton.textContent = "Add Task";
    elements.taskNameInput.focus();
  };

  const validateTaskInput = () => {
    const name = normalizeTaskName(elements.taskNameInput.value);
    const type = normalizeTaskType(elements.taskTypeInput.value);

    if (!name || !type) {
      return {
        isValid: false,
        message: "Enter a task name and choose a valid task type.",
      };
    }

    return { isValid: true, task: { name, type } };
  };

  const addTask = ({ name, type }) => {
    state.tasks.push({
      id: state.nextTaskId,
      name,
      type,
      status: TASK_STATUSES.TODO,
    });
    state.nextTaskId += 1;
    saveTasks();
    renderTasks();
    setStatusMessage("Task added.");
  };

  const updateTask = (taskId, updates) => {
    const task = getTaskById(taskId);

    if (!task) {
      setStatusMessage("That task could not be found.");
      return false;
    }

    Object.assign(task, updates);
    saveTasks();
    renderTasks();
    return true;
  };

  const handleTaskFormSubmit = (event) => {
    event.preventDefault();

    const result = validateTaskInput();

    if (!result.isValid) {
      setStatusMessage(result.message);
      elements.taskNameInput.focus();
      return;
    }

    const taskId = elements.form.getAttribute("data-task-id");

    if (taskId) {
      const wasUpdated = updateTask(taskId, result.task);

      if (wasUpdated) {
        setStatusMessage("Task updated.");
        resetTaskForm();
      }

      return;
    }

    addTask(result.task);
    resetTaskForm();
  };

  const startTaskEdit = (taskId) => {
    const task = getTaskById(taskId);

    if (!task) {
      setStatusMessage("That task could not be found.");
      return;
    }

    elements.taskNameInput.value = task.name;
    elements.taskTypeInput.value = task.type;
    elements.form.setAttribute("data-task-id", task.id);
    elements.saveTaskButton.textContent = "Save Task";
    elements.taskNameInput.focus();
    setStatusMessage(`Editing ${task.name}.`);
  };

  const deleteTask = (taskId) => {
    const task = getTaskById(taskId);

    if (!task) {
      setStatusMessage("That task could not be found.");
      return;
    }

    state.tasks = state.tasks.filter((existingTask) => existingTask.id !== task.id);
    saveTasks();
    renderTasks();
    setStatusMessage("Task deleted.");

    if (elements.form.getAttribute("data-task-id") === String(task.id)) {
      resetTaskForm();
    }
  };

  const handleTaskActionClick = (event) => {
    const actionButton = event.target.closest("button[data-task-id]");

    if (!actionButton || !elements.pageContent.contains(actionButton)) {
      return;
    }

    const taskId = actionButton.getAttribute("data-task-id");

    if (actionButton.classList.contains("edit-btn")) {
      startTaskEdit(taskId);
    } else if (actionButton.classList.contains("delete-btn")) {
      deleteTask(taskId);
    }
  };

  const handleTaskStatusChange = (event) => {
    const statusSelect = event.target.closest("select[name='status-change']");

    if (!statusSelect || !elements.pageContent.contains(statusSelect)) {
      return;
    }

    const status = normalizeStatus(statusSelect.value);
    const taskId = statusSelect.getAttribute("data-task-id");
    const wasUpdated = updateTask(taskId, { status });

    if (wasUpdated) {
      setStatusMessage(`Task moved to ${STATUS_LABELS[status]}.`);
    }
  };

  const initializeApp = () => {
    const requiredElements = [
      elements.form,
      elements.taskNameInput,
      elements.taskTypeInput,
      elements.saveTaskButton,
      elements.pageContent,
      ...Object.values(elements.taskLists),
    ];

    if (requiredElements.some((element) => !element)) {
      console.error("Taskinator could not initialize because required DOM elements are missing.");
      return;
    }

    state.tasks = readTasksFromStorage();
    state.nextTaskId = state.tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;

    elements.form.addEventListener("submit", handleTaskFormSubmit);
    elements.pageContent.addEventListener("click", handleTaskActionClick);
    elements.pageContent.addEventListener("change", handleTaskStatusChange);

    renderTasks();
  };

  initializeApp();
})();
