import "./style.css";
import {
    saveToLocalStorage,
    lists,
    selectedFromListId,
    selectListFromLocalStorage,
    deleteListFromLocalStorage,
    addDefaultList,
    addDefaultTask
} from "./modules/localStorage.js";
import { createProject } from "./modules/list.js";
import { createTask, deleteEditTask, deleteTask, updateTask } from "./modules/task.js";

const newTodo = document.getElementById("new-todo");
const newProject = document.getElementById("new-project")
const addTaskModal = document.getElementById("add-todo-modal");
const editTaskModal = document.getElementById("edit-task-modal");
const addListModal = document.getElementById("add-project-modal");
const modalBg = document.getElementById("modal-bg");
const closeAddTodoModal = document.getElementById("modal-addToDo-close");
const closeAddProjectModal = document.getElementById("modal-addProject-close");
const closeEditTaskModal = document.getElementById("modal-editTask-close");
const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-project-form]");
const newListTitle = document.querySelector("[data-new-project-input]");
const deleteFromListButton = document.querySelector("[data-delete-from-list-button]");
const listDisplayContainer = document.querySelector("[data-list-display-container]");
const listTitle = document.querySelector("[data-list-title]");
const tasksContainer = document.querySelector("[data-tasks]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const taskTitle = document.querySelector("[data-task-title]");
const taskDescription = document.querySelector("[data-task-description]");
const taskDueDate = document.querySelector("[data-task-due-date]");
const taskPriority = document.querySelector("[data-task-priority]");
const newEditForm = document.querySelector("[data-edit-task-form]");
const editTitle = document.querySelector("[data-edit-task-title]");
const editDescription = document.querySelector("[data-edit-task-description]");
const editDuedate = document.querySelector("[data-edit-task-due-date]");
const editPriority = document.querySelector("[data-edit-task-priority]");
const editTaskId = document.querySelector("#edit-task-id");
const editTaskStatus = document.querySelector("#edit-task-status");

tasksContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "input") {
        const selected = lists.find(list => list.id === selectedFromListId);
        const selectedTask = selected.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        saveToLocalStorage();
    }
})

listsContainer.addEventListener("click", (e) => {
    selectListFromLocalStorage(e);
    saveAndRender();
});

deleteFromListButton.addEventListener("click", (e) => {
    e.preventDefault();
    deleteListFromLocalStorage();
    saveAndRender();
})

newListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const listTitle = newListTitle.value;
    if (listTitle == null || listTitle === "") return;
    const list = createProject(listTitle);
    newListTitle.value = null;
    lists.push(list);
    addListModal.close();
    modalBg.style.display = "none";
    saveAndRender();
    newListForm.reset();
    addListModal.close();
    modalBg.style.display = "none";
})

newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTaskTitle = taskTitle.value;
    const newTaskDescription = taskDescription.value;
    const newTaskDueDate = taskDueDate.value;
    const newTaskPriority = taskPriority.value;
    if (newTaskTitle == null || newTaskTitle === "") return;
    const task = createTask(newTaskTitle, newTaskDescription, newTaskDueDate, newTaskPriority);
    const selected = lists.find(list => list.id === selectedFromListId);
    selected.tasks.push(task);
    saveAndRender();
    newTaskForm.reset();
    addTaskModal.close();
    modalBg.style.display = "none";
});

newEditForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentId = editTaskId.value;
    const currentStatus = editTaskStatus.value;
    const editTaskTitle = editTitle.value;
    const editTaskDescription = editDescription.value;
    const editTaskDuedate = editDuedate.value;
    const editTaskPriority = editPriority.value;
    if (editTaskTitle == null || editTaskTitle === "") return;
    deleteEditTask(currentId);
    const task = updateTask(currentId, editTaskTitle, editTaskDescription, editTaskDuedate, editTaskPriority, currentStatus);
    const selected = lists.find(list => list.id === selectedFromListId);
    selected.tasks.unshift(task);
    saveAndRender();
    newEditForm.reset();
    editTaskModal.close();
    modalBg.style.display = "none";
});

newTodo.addEventListener("click", () => {
    addTaskModal.showModal();
    modalBg.style.display = "block";
});

closeAddTodoModal.addEventListener("click", () => {
    addTaskModal.close();
    modalBg.style.display = "none";
});

newProject.addEventListener("click", () => {
    addListModal.showModal();
    modalBg.style.display = "block";
});

closeAddProjectModal.addEventListener("click", () => {
    addListModal.close();
    modalBg.style.display = "none";
});

closeEditTaskModal.addEventListener("click", () => {
    editTaskModal.close();
    modalBg.style.display = "none";
})

function saveAndRender() {
    saveToLocalStorage();
    render();
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedFromListId);

    if (selectedList == null) {
        listDisplayContainer.style.display = "none";
    } else {
        listDisplayContainer.style.display = "";
        listTitle.textContent = selectedList.name;
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        const inputCheck = document.createElement("input");
        inputCheck.type = "checkbox";
        inputCheck.classList.add("task-check")
        taskDiv.appendChild(inputCheck);

        const taskInnerDiv = document.createElement("div");
        taskInnerDiv.setAttribute("data-edit-id", task.id);
        taskInnerDiv.classList.add("task-inner-div");
        inputCheck.after(taskInnerDiv);

        const titleLabel = document.createElement("label");
        titleLabel.id = "task-label";
        titleLabel.innerText = task.name;
        taskInnerDiv.appendChild(titleLabel);

        const taskDesc = document.createElement("p");
        taskDesc.classList.add("task-desc");
        taskDesc.innerText = task.description;
        taskInnerDiv.appendChild(taskDesc);

        const taskDuedate = document.createElement("p");
        taskDuedate.classList.add("task-date");
        taskDuedate.innerText = task.dueDate;
        taskInnerDiv.appendChild(taskDuedate);

        const taskPrio = document.createElement("p");
        taskPrio.classList.add("task-prio");
        taskPrio.innerText = task.priority;
        taskInnerDiv.appendChild(taskPrio);

        switch (task.priority) {
            case ("Low"):
                taskPrio.classList.add("task-prio-low");
                break;
            case ("Medium"):
                taskPrio.classList.add("task-prio-medium");
                break;
            case ("High"):
                taskPrio.classList.add("task-prio-high");
            default:
        }

        const buttonDiv = document.createElement("div");
        buttonDiv.innerHTML = `
            <div class="task-button-container">
                <button class="delete-task-button" data-id="${task.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `

        taskDiv.appendChild(buttonDiv);

        const checkbox = taskDiv.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.complete;

        const deleteTaskButton = taskDiv.querySelector(".delete-task-button");

        deleteTaskButton.addEventListener("click", (e) => {
            deleteTask(e);
            saveAndRender();
        })

        taskInnerDiv.addEventListener("click", (e) => {
            renderEditForm(e);
            editTaskModal.showModal();
            modalBg.style.display = "block";
        })

        tasksContainer.appendChild(taskDiv);
    });
}

function renderEditForm(event) {
    const currentId = event.currentTarget.dataset.editId;
    const selected = lists.find(list => list.id === selectedFromListId);
    const task = selected.tasks.find(task => task.id === currentId);

    editTitle.value = task.name;
    editDescription.value = task.description;
    editDuedate.value = task.dueDate;
    editPriority.value = task.priority;
    editTaskId.value = task.id;
    editTaskStatus.value = task.complete;
}

function renderLists() {
    if (lists.length === 0) {
        addDefaultList();
        addDefaultTask();
    }
    lists.forEach(list => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.textContent = list.name;
        if (list.id === selectedFromListId) {
            listElement.classList.add("active-list");
        }
        listsContainer.appendChild(listElement);
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();