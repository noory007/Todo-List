import { lists, selectedFromListId } from "./localStorage.js";

export function createTask(name, description, dueDate, priority) {
    return {
        id: Date.now().toString(),
        name,
        description,
        dueDate,
        priority,
        complete: false
    }
}

export function updateTask(currentId, name, description, dueDate, priority, complete) {
    return {
        id: currentId,
        name,
        description,
        dueDate,
        priority,
        complete
    }
}

export function deleteEditTask(event) {
    const selected = lists.find(list => list.id === selectedFromListId);
    const currentId = event;

    selected.tasks = selected.tasks.filter(task => task.id !== currentId);
}

export function deleteTask(event) {
    const selected = lists.find(list => list.id === selectedFromListId);
    const currentId = event.currentTarget.dataset.id;

    selected.tasks = selected.tasks.filter(task => task.id !== currentId);
}