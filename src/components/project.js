export default function ShowProject(project) {
    console.log("making Project Info")

    const div = document.createElement('div');
    const title = document.createElement('h1');
    // const subTitle = document.createElement('h2');
    // const text = document.createElement('p');

    title.textContent = project.name;
    div.style.backgroundColor = project.color;
    div.classList.add("content")
    
    div.append(title);

    return div
}