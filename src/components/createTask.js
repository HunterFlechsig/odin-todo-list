export default function CreateTask(task = {}) {
    const { title } = task;

    const div = document.createElement("div");
    div.classList.add("create-task");

    const form = document.createElement("form");
    form.classList.add("add-task");

    const titleInput = document.createElement("input");
    titleInput.name = "title";
    titleInput.maxLength = 100;
    titleInput.minLength = 1;
    title ? titleInput.textContent = title : titleInput.placeholder = "add task"

    const date = document.createElement("input"); 
    date.type = "date";

    const button = document.createElement("button");
    button.type = 'submit';
    button.classList.add("material-symbols-outlined", "hidden-btn")

    form.append(titleInput,date,button);
    div.append(form);

    return div;
}