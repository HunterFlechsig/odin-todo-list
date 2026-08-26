export default function Sidebar(projects) {
    console.log("making Sidebar with: ", projects);

    const fragment = new DocumentFragment();

    projects.forEach(project => {
        const item = document.createElement("li");
        item.textContent = project.name;
        fragment.appendChild(item);
    });

    return fragment;
}