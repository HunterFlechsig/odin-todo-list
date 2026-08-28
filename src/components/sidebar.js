import { SideBarController } from "../index.js";
import "../styles/sidebar.css"

export default function Sidebar(projects) {

    const fragment = new DocumentFragment();

    projects.forEach((project, index) => {
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

        let star = document.createElement("span");
        let deleteSpan = document.createElement("span");

        if(index === 0) {
            span.style.fontWeight = "900";
            span.textContent = span.textContent += "*";
        }
        
        if(index > 0) {
            deleteSpan.textContent = "delete";
            deleteSpan.dataset["action"] = "delete"
            deleteSpan.classList.add("material-symbols-outlined", "hidden-btn")

            star.textContent = "star";
            star.dataset["action"] = "star"
            star.classList.add("material-symbols-outlined", "hidden-btn")
        }

        item.append(dot, span, fill, star, edit, deleteSpan);
        fragment.appendChild(item);
    });

    return fragment;
}