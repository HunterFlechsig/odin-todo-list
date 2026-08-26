
function GetUserName(project) {
    console.log("making getUserName")

    const fragment = new DocumentFragment();

    const input = document.createElement('input');
    input.classList.add("basic-input");
    input.placeholder = "Add your name";
    input.required = true;
    input.maxLength = 50;
    input.name = "username"

    const button = document.createElement("button");
    button.classList.add('submit-btn');
    button.type = "submit";
    button.textContent = "Continue";

    fragment.append(input, button);
    return fragment;
    
}

export { GetUserName };