export default function CreateTaskInput(id) {
    const form = document.createElement("form");
    form.classList.add("add-task");


    const input = document.createElement("input");
    input.name = "title";
    input.maxLength = 100;
    input.placeholder = "add task"

    const button = document.createElement("button");
    button.type = 'submit';
    button.classList.add("material-symbols-outlined", "hidden-btn")

    const date = document.createElement("input"); 
    date.type = "date";
    
    const otherInputs = document.createElement("div");
    otherInputs.classList.add("add-task-other");
    otherInputs.append(date);

    const arrow = document.createElement("span");
    arrow.classList.add("add-task-icon");
    arrow.textContent = "arrow_upward";

    const add = document.createElement("span");
    add.classList.add("material-symbols-outlined" , "add-task-plus");
    add.textContent = "add";

    const mainInput = document.createElement("div")
    mainInput.append(input, add, button);
    mainInput.classList.add("add-task-title")

    button.append(arrow);
    form.append(otherInputs, mainInput);
    form.id = id;

    return form;
}