import "./styles/styles.css";
import ShowProject from "./components/project.js";
import { AppData, Project } from "./classes.js";
import { GetDeleteConfirmation, GetProjectInfo } from "./components/modals.js";
import Sidebar from "./components/sidebar.js";
import { MyDay, AllTasks } from "./components/lists.js";

class DataController {
    static DATA_KEY = "data"

    constructor() {
        this.#hasData() ? this.#loadData() : this.#createAppData();
        console.log("initial data:", this.data);
    }

    storeData = () => {
        localStorage.setItem("data",JSON.stringify(this.data));
        console.log(`Storing data: ${this.data}`)
    }

    #loadData = () => {
        console.log("loading data");

        const localData = JSON.parse(localStorage.getItem("data"));
        this.data = AppData.fromJSON(localData);
    }

    #createAppData = () => {
        console.log("creating data");
        
        this.data = new AppData();
        this.storeData();
    }

    #hasData = () => {
       if(localStorage.getItem("data")) {
            return true;
       }
       return false;
    }
}

function clearAndSet(element, fragment) {
    element.replaceChildren();
    element.appendChild(fragment);
}

// render forms and send data back
class ModalFormController {
    constructor(DataController) {
        this.data = DataController
        this.modal = document.getElementById("dialog");
        this.modalForm = document.getElementById("dialog-form");
        this.selectedItem = null;
        this.callback = null;

        // on submit send data back to screen controller with callback
        this.modalForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (this.callback) {
                this.callback(this.#getFormDataAsObject(this.modalForm));
            }

            this.modal.close();
        });

        this.modal.addEventListener("keydown", (e) => {
            if(e.keydown == "escape") {
                this.modal.close();
            }
        })
    }

    #getFormDataAsObject() {
        const formData = new FormData(this.modalForm);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);
        return formDataObj;
    }

    // takes a function to create form, data to fill the form in, 
    // a callback to do something with data recieved
    #useModal(creationfunc, data, onSubmit) {
        console.log("using modal")
        const modal = creationfunc(data);
        clearAndSet(this.modalForm, modal.fragment);
        this.callback = onSubmit;
        this.modal.showModal();
    }

    getProjectInfo(onSubmit, project = {}) {
        this.#useModal(GetProjectInfo, project, onSubmit);
    }

    getDeleteConfirmation(onSubmit) {
        this.#useModal(GetDeleteConfirmation, {}, onSubmit);
    }

}

// render and controll sidebar 
class SideBarController {
    static projectDataSetName = "projectId"
    static sidebarDataSetName = "sideBarId"

    constructor() {
        this.projects = document.querySelector(".proj-list");
        this.addProjectButton = document.getElementById("add-proj");
        this.tasks = document.querySelector(".tasks-list");
        this.lastSelectedItem = null;
    }

    onAddProject(callback) {
        this.addProjectButton.addEventListener("click", callback);
    }

    onSelectProject(callback) {
        this.projects.addEventListener("click", callback);
    }

    onSelectTask(callback) {
        this.tasks.addEventListener("click", callback)
    }

    #setSelectedItem(id) {
        const item = document.getElementById(id);
        item.classList.add("selected");
        if(this.lastSelectedItem) {
            const lastSelectedItem = document.getElementById(this.lastSelectedItem);
            lastSelectedItem.classList.remove("selected");
        }
        this.lastSelectedItem = id; 
    }

    render(projects, selectedItemId) {
        const projectsList = Sidebar(projects);   
        this.projects.replaceChildren(this.projects.firstElementChild);
        this.projects.appendChild(projectsList);

        console.log("sidebar render", selectedItemId);

        if(selectedItemId) this.#setSelectedItem(selectedItemId);
    }
}

class MainContentController {

    constructor() {
        this.content = document.querySelector(".content");
    }

    #viewActions = {
        project : (project) => {
            return ShowProject(project);
        },

        myDay: () => {
            return MyDay();
        },

        allTasks: () => {
            return AllTasks();
        }
    }

    render(view) {
        console.log(view);
        if(!(view.type in this.#viewActions)) throw new Error(`View ${view.type} type doesnt Exist`)
        clearAndSet(this.content, this.#viewActions[view.type](view.data));
    }
}

class AppController {
    constructor() {
        this.storage = new DataController();
        this.data = this.storage.data;
        this.modal = new ModalFormController();
        this.sidebar = new SideBarController();
        this.main = new MainContentController();
        this.#taskActions["my-day"]();
        this.selectedSideBarItem = "my-day";
    }

    #projectActions = {
        show: (id) => {
            this.view = {
                type: "project",
                data: this.data.getProject(id),
            }
            this.selectedSideBarItem = id;
        },

        edit: (id) => {
            const callback = formData => {
                this.data.updateProject(id, formData.title, formData.color);
                this.storage.storeData();
                this.render();
            }
            this.modal.getProjectInfo(callback, this.data.getProject(id));
        },

        delete: (id) => {
            this.modal.getDeleteConfirmation(() => {
                this.data.deleteProject(id)
                this.storage.storeData();
                this.render()
            })
        },
    }

    #taskActions = {
        ["my-day"]: () => {
            this.view = {
                type: "myDay",
                data: this.data.getTodaysTasks(),
            }
        },

        ["all-tasks"]: () => {
            this.view = {
                type: "allTasks",
                data: this.data.getAllTasks(),
            }
        },
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.sidebar.onAddProject(() => {
            this.modal.getProjectInfo(formData => {
                this.data.addProject(new Project(formData.title, formData.color));
                this.storage.storeData();
                this.render();
            });
        })

        this.sidebar.onSelectProject((e) => {
            const project = e.target.closest(".sidebar-project");
            if (!project) return;

            const projectId = project.id;
            const action = e.target.closest("[data-action]")?.dataset.action ?? "show";

            console.log(projectId, action);
            this.#projectActions[action](projectId);
            this.render();
        })

        this.sidebar.onSelectTask((e) => {
            const itemId = e.target.id;
            console.log("clicked tasks: ", itemId);
            this.selectedSideBarItem = itemId;
            this.#taskActions[itemId]();
            this.render();
        })
    }

    render() {
        this.sidebar.render(this.data.Projects, this.selectedSideBarItem);
        this.main.render(this.view);
    }
}

const app = new AppController().init();
export { SideBarController }