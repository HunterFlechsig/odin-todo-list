export default function ShowProject(project) {
    console.log("making Project Info");

    const fragment = document.createDocumentFragment();

    const div = document.createElement('div');
    const title = document.createElement('h1');
    div.classList.add("main");
    title.style.border = `3px solid ${project.color}`
    // const subTitle = document.createElement('h2');
    // const text = document.createElement('p');

    title.textContent = project.name;

    
    fragment.append(title, div);

    return fragment
}