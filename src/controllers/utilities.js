function clearAndSet(element, fragment) {
    element.replaceChildren();
    element.appendChild(fragment);
}

function getFormDataAsObject(data) {
    const formData = new FormData(data);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    return formDataObj;
}

function capatalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { clearAndSet, getFormDataAsObject, capatalize }