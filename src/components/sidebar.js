import { SideBarController } from "../index.js";
import "../styles/sidebar.css"

export default function Sidebar(projects) {
    console.log("making Sidebar with: ", projects);

    const fragment = new DocumentFragment();

    projects.forEach(project => {
        const item = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = project.name;
        item.dataset["action"] = "show"
        item.id = project.id;
        item.classList.add("sidebar-project")
        
        const dot = document.createElement("span");
        dot.classList.add("project-color");
        dot.style.background = project.color;

        const fill = document.createElement("span");
        fill.style.flex = "1";

        const edit = document.createElement("span");
        edit.textContent = "edit";
        edit.dataset["action"] = "edit"
        edit.classList.add("material-symbols-outlined", "hidden-btn")

        const deleteSpan = document.createElement("span");
        deleteSpan.textContent = "delete";
        deleteSpan.dataset["action"] = "delete"
        deleteSpan.classList.add("material-symbols-outlined", "hidden-btn")

        item.append(dot,span, fill, edit, deleteSpan);
        fragment.appendChild(item);
    });

    return fragment;
}