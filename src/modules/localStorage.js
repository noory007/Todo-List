import { createProject } from "./list";
import { createTask } from "./task";

const LOCAL_STORAGE_PROJECT_KEY = "project.list";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "project.slectedListId";

export let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
export let selectedFromListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);

export function addDefaultList() {
    const name = "Inbox";
    const defaultProject = createProject(name);
    lists.push(defaultProject);
}

export function addDefaultTask() {
    const name = "Task Name";
    const desc = "Description";
    const date = new Date().toLocaleDateString("en-GB");
    const prio = "Low";
    const defaultTaks = createTask(name, desc, date, prio);
    const selected = lists.find(list => list.id);
    selected.tasks.push(defaultTaks);
}

export function saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedFromListId);
}

export function selectListFromLocalStorage(e) {
    if (e.target.tagName.toLowerCase() === "li");
    selectedFromListId = e.target.dataset.listId;
}

export function deleteListFromLocalStorage() {
    lists = lists.filter(list => list.id !== selectedFromListId);
    selectedFromListId = null;
}