class ModalformData {
    constructor(names) {
        this.formNames = names
        this.fragment = new DocumentFragment();
    }

    add(elements) {
        this.fragment.append(...elements);
    }
}

function GetUserName() {
    console.log("making getUserName")

    const form = new ModalformData(['username'])

    const input = document.createElement('input');
    input.classList.add("basic-input");
    input.placeholder = "Add your name";
    input.required = true;
    input.maxLength = 50;
    input.name = form.formNames[0];

    const button = document.createElement("button");
    button.classList.add('submit-btn');
    button.type = "submit";
    button.textContent = "Continue";

    form.add([input,button])
    return form;
}

function GetProjectInfo() {
    console.log("making getProject")

    const form = new ModalformData(['title','color'])

    const input = document.createElement('input');
    input.classList.add("basic-input");
    input.placeholder = "Add your project title";
    input.required = true;
    input.maxLength = 50;
    input.name = form.formNames[0];

    const colorInput = document.createElement('input');
    const colorLabel = document.createElement('label');
    const colorDiv = document.createElement('div');
    colorInput.type = "color";
    colorInput.id = "color";
    colorInput.name = "color";
    colorLabel.htmlFor = "color";
    colorLabel.textContent = "choose color";
    colorDiv.classList.add('color-picker');
    colorDiv.append( colorLabel, colorInput);

    const button = document.createElement("button");
    button.classList.add('submit-btn');
    button.type = "submit";
    button.textContent = "Continue";

    form.add([input,colorDiv,button])
    return form
}

export { GetUserName, GetProjectInfo };