import "./styles/styles.css";
import ShowProject from "./components/project.js";
import { AppData, Project } from "./classes.js";
import { GetDeleteConfirmation, GetProjectInfo } from "./components/modals.js";
import Sidebar from "./components/sidebar.js";

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

// render forms and senf data back
class ModalFormController {
    constructor(DataController) {
        this.data = DataController
        this.modal = document.getElementById("dialog");
        this.modalForm = document.getElementById("dialog-form");

        this.callback = null;

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

class SideBarController {
    static projectDataSetName = "projectId"
    constructor() {
        this.projects = document.querySelector(".proj-list");
        this.addProjectButton = document.getElementById("add-proj");
        this.tasks = document.querySelector(".tasks-list");
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

    render(Projects) {
        const projectsList = Sidebar(Projects);   
        this.projects.replaceChildren(this.projects.firstElementChild);
        this.projects.appendChild(projectsList);
    }
}

class MainContentController {
    render() {

    }
}

class AppController {
    constructor() {
        this.storage = new DataController();
        this.data = this.storage.data;
        this.modal = new ModalFormController();
        this.sidebar = new SideBarController();
        this.main = new MainContentController();
        this.selectedProjectId = null;
    }

    #projectActions = {
        show: (id) => {},

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
        myDay: () => {},

        nextSeven: () => {},

        all: (id) => {
            this.modal.getDeleteConfirmation(() => {
                this.data.deleteProject(id)
                this.storage.storeData();
                this.render()
            })
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
            const projectId = e.target.dataset[SideBarController.projectDataSetName];
            const action = e.target.dataset["action"];

            console.log(projectId, action);
            if(projectId && action) {
                console.log("before", this.data)
                this.selectedProjectId  = projectId;
                this.#projectActions[action](projectId);
            }
        })

        this.sidebar.onSelectTask((e) => {

        })
    }

    render() {
        this.sidebar.render(this.data.Projects);
    }
}

const app = new AppController().init();
export { SideBarController }