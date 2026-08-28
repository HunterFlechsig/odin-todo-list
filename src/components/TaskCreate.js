export default function CreateTaskInput(id) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");
    button.type = 'submit';
    input.name = "title";
    form.append(input,button);
    form.id = id;

    return form;
}