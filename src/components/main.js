import { Todo } from "../controllers/dataClasses.js";

function ShowProject(project, TodoList) {
    const fragment = document.createDocumentFragment();

    const createAddButton = () => {
        const button = document.createElement("button");
        const span = document.createElement("span");
        span.textContent = "add";
        span.classList.add("material-symbols-outlined");
        button.append(span);
        button.dataset["mainAction"] = "add";
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

    const deleteButton = () => {
        const button = document.createElement("button");
        button.textContent = "X";
        button.style.display = "none"
        button.dataset["mainAction"] = "delete"
        return button
    }

    todos.forEach((todo, index) => {
        const item = document.createElement("li");
        const text = document.createElement("span")
        text.textContent = todo.title;
        item.id = todo.id;
        item.classList.add("todo-item");
        item.dataset["mainAction"] = "show";

        const label = document.createElement("label");
        const input = document.createElement("input");
        input.name = todo.id;
        input.type = "checkbox";
        input.checked = todo.status === Todo.STATUS.DONE;
        input.dataset["mainAction"] = "change"
        const button = deleteButton()

        if(todo.status === Todo.STATUS.DONE) {
            text.style.textDecoration = "line-through";
            button.style.display = "block"
        }

        label.append(input);
        item.append(label, text, button)
        ul.appendChild(item);
    });

    return ul;
}

function CreateTask(task = {}, projects, selectedProject) {
    const { desc, dueDate, priority, status, title } = task;

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
            input.placeholder = "Create New Task"
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
        desc ? notesInput.textContent = desc : notesInput.placeholder = "Insert your notes here";

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
            option.value = project.id;
            option.textContent = project.name;
            select.append(option);
        });        

        label.append(select);
        return label;
    }

    const createDate = () => {
        const label = document.createElement("label");
        label.htmlFor = "dueDate";
        label.textContent = "Due Date";

        const date = document.createElement("input"); 
        date.type = "datetime-local";
        date.name = "dueDate";
        date.id = "dueDate";
        if(!dueDate) {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            date.value = now.toISOString().slice(0, 16);
        } else {
            date.value = dueDate;
        }

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
            if(+priority === Todo.PRIORITY[p]) option.selected = true;
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

    const hiddenStatus = document.createElement("input");
    hiddenStatus.type = 'hidden';
    hiddenStatus.name = 'status';
    hiddenStatus.value = task.status ? task.status : Todo.STATUS.OPEN;

    const inputDiv = document.createElement("div");
    inputDiv.classList = "input-div";

    const topTitle = document.createElement("h4");
    topTitle.textContent = `Projects > ${selectedProject.name}`

    inputDiv.append(createDate(), createProjectsDropDown(), createPriority());
    form.append(topTitle, titleInput(), inputDiv, createNotesInput(), hiddenStatus);

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Create"
    button.classList.add("submit-btn");
    button.textContent = title ? "Update" : "Create";
    form.append(button);

    div.append(form);

    return div;
}

export default function Main(selectedProject, projects, task) {
    const fragement = document.createDocumentFragment();
    fragement.append(ShowProject(selectedProject, TodoList(selectedProject.todos)), CreateTask(task, projects, selectedProject));
    return fragement;
}