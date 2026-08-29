import { Todo } from "../controllers/dataClasses.js";

export default function CreateTask(task = {}, projects, selectedProject) {
    const { title, notes } = task;

    const titleInput = () => {
        const input = document.createElement("input");
        input.name = "title";
        input.maxLength = 100;
        input.minLength = 1;
        input.classList.add("basic-input");
        title ? input.textContent = title : input.placeholder = "add task name"
        return input;
    }

    const createNotesInput = () => {
        const notesLabel = document.createElement("label");
        notesLabel.htmlFor = "notes";
        notesLabel.textContent = "Notes";

        const notesInput = document.createElement("textarea");
        notesInput.id = "notes";
        notesInput.name = "notes";
        notes ? notesInput.textContent = title : notesInput.placeholder = "Insert your notes here";

        notesLabel.append(notesInput);
        return notesLabel;
    }

    const createProjectsDropDown = () => {
        const label = document.createElement("label");
        label.htmlFor = "project";
        label.textContent = "Project";

        const select = document.createElement("select");
        select.id = "project";

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
        const selected = false;

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

    const form = document.createElement("form");
    form.classList.add("create-task-form");

    const inputDiv = document.createElement("div");
    inputDiv.classList = "input-div";

    const topTitle = document.createElement("h4");
    topTitle.textContent = `Projects > ${selectedProject.name}`

    const button = document.createElement("button");
    button.type = 'submit';
    button.classList.add("material-symbols-outlined", "hidden-btn")

    inputDiv.append(createDate(), createProjectsDropDown(), createPriority());

    form.append(topTitle, titleInput(), inputDiv, createNotesInput(), button);
    div.append(form);

    return div;
}