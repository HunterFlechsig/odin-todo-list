import "./styles/styles.css";
import Sidebar from "./components/sidebar.js";
import { data, storage } from "./controllers/data.js";
import Modal from "./controllers/modal.js";
import MainController from "./controllers/main.js";

class SideBarController {
    static projectDataSetName = "projectId"
    static sidebarDataSetName = "sideBarId"

    constructor(startingSelect) {
        this.sidebar = document.querySelector(".sidebar");
        this.projects = document.querySelector(".proj-list");
        this.selectedItemId = startingSelect;
    }

    #setSelectedItem() {
        const lastSelectedItem = document.querySelector(".sidebar-item.selected")
        const item = document.getElementById(this.selectedItemId);
        if(item) item.classList.add("selected"); 
        if(lastSelectedItem) lastSelectedItem.classList.remove("selected");
    }

    onAction(callback) {
        this.sidebar.addEventListener("click", (e) => {
            const sidebarItem = e.target.closest("[data-action]");
            const liItem = e.target.closest("li");

            if(!liItem) return 
            if(!sidebarItem) return;

            this.selectedItemId = liItem.id;

            callback({
                action: sidebarItem.dataset.action,
                id: this.selectedItemId,
            })
        })
    }

    render(projects) {
        const projectsList = Sidebar(projects);   
        this.projects.replaceChildren(this.projects.firstElementChild);
        this.projects.appendChild(projectsList);
        this.#setSelectedItem()
    }
}

class AppController {
    constructor() {
        this.storage = storage;
        this.data = data;
        this.modal = new Modal();
        this.sidebar = new SideBarController(this.data.defualtProject.id);
        this.main = new MainController();

        this.#sideBarAction["show"](this.data.defualtProject.id);
    }

    #sideBarAction = {
        ["add-project"] : () => {
            this.modal.open({
                action: "add-project",
                data: {
                    project: {},
                }
            })
        },

        ["edit"]: (id) => {
            this.modal.open({
                action: "edit-project",
                data: {
                    project: this.data.getProject(id),
                }
            })
        },

        ["delete"]: (id) => {
            this.modal.open({
                action: "delete",
                data: {
                    project: this.data.getProject(id),
                },
            })
        },

        ["star"]: (id) => {
            this.data.setDefualtProject(id);
            this.storage.storeData();
        },

        ["my-day"]: () => {
            this.view = {
                type: "myDay",
                data: {
                    todos: this.data.getTodaysTasks(),
                }
            }
        },

        ["all-tasks"]: () => {
            this.view = {
                type: "allTasks",
                data: {
                    todos: this.data.getAllTasks(),
                }
            }
        },

        ["show"]: (id) => {
            this.view = {
                type: "project",
                data: {
                    selectedProject: this.data.getProject(id),
                    projects:  this.data.Projects,
                }
            }
        }
    }

    init() {
        this.render();
        this.bindEvents();
    }

    bindEvents() {
        this.sidebar.onAction((action) => {
            this.#sideBarAction[action.action](action.id);
            this.render();
        })

        this.modal.onAction((action) => {
            this.render();
        })
    }

    render() {
        this.sidebar.render(this.data.Projects);
        this.main.render(this.view);
    }
}

const app = new AppController().init();