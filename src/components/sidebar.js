import { SideBarController } from "../index.js";

export default function Sidebar(projects) {
    console.log("making Sidebar with: ", projects);

    const fragment = new DocumentFragment();

    projects.forEach(project => {
        const item = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = project.name;
        item.dataset[SideBarController.projectDataSetName] = project.id;
        item.classList.add("sidebar-project")
        
        const dot = document.createElement("span");
        dot.classList.add("project-color");
        dot.style.background = project.color;

        item.append(dot,span);
        fragment.appendChild(item);
    });

    return fragment;
}