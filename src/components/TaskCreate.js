export default function CreateTaskInput(id) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");
    button.type = 'submit';
    input.name = "title";
    input.maxLength = 50;

    const add = document.createElement("span");
    add.classList.add("material-symbols-outlined")
    add.textContent = "arrow_upward";

    form.classList.add("add-task");
    
    button.append(add);
    form.append(input, button);
    form.id = id;

    return form;
}