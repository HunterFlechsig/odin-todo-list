function ShowProject(project, TodoList) {
    const fragment = document.createDocumentFragment();

    const createAddButton = () => {
        const button = document.createElement("button");
        const span = document.createElement("span");
        span.textContent = "add";
        span.classList.add("material-symbols-outlined");
        button.append(span);
        button.dataset.action = "add";
        button.id = "create-todo";

        return button;
    }

    const div = document.createElement('div');
    const title = document.createElement('h1'); 
    div.append(document.createElement("div"));
    div.classList.add("main");
    title.style.border = `3px solid ${project.color}`

    title.textContent = project.name;

    div.append(TodoList, createAddButton());
    
    fragment.append(title, div);

    return fragment
}

function TodoList(todos, selectedTodo) {
    const ul = document.createElement("ul");
    ul.dataset.action = "show"

    todos.forEach((todo, index) => {
        const item = document.createElement("li");
        item.textContent = todo.title;
        item.id = todo.id;
        item.classList.add("todo-item");
        ul.appendChild(item);
    });

    return ul;
}

import { Todo } from "../controllers/dataClasses.js";

function CreateTask(task = {}, projects, selectedProject) {
    const { desc, dueDate, id, priority, status, title } = task;
    console.log("task create", title);

    const titleInput = () => {
        const input = document.createElement("input");
        input.name = "title";
        input.maxLength = 100;
        input.minLength = 1;
        input.dataset['action'] = "submit"; 
        input.classList.add("basic-input");
        if(title) {
            input.value = title
        } else {
            input.placeholder = "add task name"
        }
        return input;
    }

    const createNotesInput = () => {
        const notesLabel = document.createElement("label");
        notesLabel.htmlFor = "notes";
        notesLabel.textContent = "Notes";

        const notesInput = document.createElement("textarea");
        notesInput.id = "notes";
        notesInput.name = "desc";
        desc ? notesInput.textContent = title : notesInput.placeholder = "Insert your notes here";

        notesLabel.append(notesInput);
        return notesLabel;
    }

    const createProjectsDropDown = () => {
        const label = document.createElement("label");
        label.htmlFor = "project";
        label.textContent = "Project";

        const select = document.createElement("select");
        select.id = "project";
        select.name = "project";

        projects.forEach(project => {
            const option = document.createElement("option");
            if(selectedProject.id === project.id) option.selected = true;
            option.value = project.name;
            option.textContent = project.name;
            select.append(option);
        });        

        label.append(select);
        return label;
    }

    const createDate = () => {
        const label = document.createElement("label");
        label.htmlFor = "data";
        label.textContent = "Due Date";

        const date = document.createElement("input"); 
        date.type = "datetime-local";
        date.name = "date";
        date.id = "date";
        const now = new Date();
        now.setDate(now.getDate() + 1);
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        date.value = now.toISOString().slice(0, 16);

        label.append(date);

        return label
    }

    const createPriority = () => {
        const label = document.createElement("label");
        label.htmlFor = "priority";
        label.textContent = "priority";

        const select = document.createElement("select");
        select.id = "priority";
        select.name = "priority";

        Object.keys(Todo.PRIORITY).forEach(p => {
            const option = document.createElement("option");
            option.value = Todo.PRIORITY[p];
            option.textContent = Todo.PRIORITY[p];
            select.append(option);
        });        

        label.append(select);
        return label;
    }

    const div = document.createElement("div");
    div.classList.add("create-task");
    div.dataset['action'] = "submit"; 
    div.dataset['taskId'] = task.id ? task.id : null;

    const form = document.createElement("form");
    form.id = "create-task-form";

    const inputDiv = document.createElement("div");
    inputDiv.classList = "input-div";

    const topTitle = document.createElement("h4");
    topTitle.textContent = `Projects > ${selectedProject.name}`

    inputDiv.append(createDate(), createProjectsDropDown(), createPriority());
    form.append(topTitle, titleInput(), inputDiv, createNotesInput());

    if(!title) {
        const button = document.createElement("button");
        button.type = "submit";
        button.textContent = "Create"
        button.classList.add("submit-btn");
        button.textContent = "create";
        form.append(button);
    }

    div.append(form);

    return div;
}

export default function Main(selectedProject, projects, task) {
    const fragement = document.createDocumentFragment();
    fragement.append(ShowProject(selectedProject, TodoList(selectedProject.todos)), CreateTask(task, projects, selectedProject));
    return fragement;
}