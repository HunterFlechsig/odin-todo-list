import "../styles/modal.css"

class ModalformData {
    constructor(names) {
        this.formNames = names
        this.fragment = new DocumentFragment();
    }

    add(elements) {
        this.fragment.append(...elements);
    }
}

const createSubmitBtn = (text) => {
    const button = document.createElement("button");
    button.classList.add('submit-btn');
    button.type = "submit";
    button.textContent = text;
    return button
}

function GetDeleteConfirmation() {
    console.log("checking Delete")

    const form = new ModalformData([])

    const title = document.createElement('h1');
    title.textContent = "Are you sure you want to delete?";

    const button = createSubmitBtn("Continue")

    form.add([title, button])
    return form;
}

function GetProjectInfo(project = {}) {
    console.log("making getProject: ", project)

    const form = new ModalformData(['title','color']);

    const input = document.createElement('input');
    input.classList.add("basic-input");
    project["name"] ? input.value = project.name : input.placeholder = "Add your project title";
    input.required = true;
    input.maxLength = 50;
    input.name = form.formNames[0];

    const colorInput = document.createElement('input');
    const colorLabel = document.createElement('label');    
    const colorDiv = document.createElement('div');
    colorInput.type = "color";
    colorInput.id = "color";
    colorInput.name = "color";
    colorInput.value = project["color"] ? project.color : "var(--clr-primary-purple)"
    colorLabel.htmlFor = "color";
    colorLabel.textContent = "choose color";
    colorDiv.classList.add('color-picker');
    colorDiv.append( colorLabel, colorInput);
    
    const button = createSubmitBtn("Continue")

    form.add([input,colorDiv,button])
    return form
}

export { GetDeleteConfirmation, GetProjectInfo };