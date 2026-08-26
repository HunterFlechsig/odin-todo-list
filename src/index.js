import "./styles.css";
import ShowProject from "./components/project.js";
import { AppData, Project } from "./classes.js";
import { GetProjectInfo, GetUserName } from "./components/modals.js";
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

    #useModal(creationfunc, onSubmit) {
        console.log("using modal")
        const modal = creationfunc();
        clearAndSet(this.modalForm, modal.fragment);
        this.callback = onSubmit;
        this.modal.showModal();
    }

    getProjectInfo(onSubmit) {
        this.#useModal(GetProjectInfo, onSubmit);
    }
}

class SideBarController {
    static projectDataSetName = "projectId"
    constructor() {
        this.projects = document.querySelector(".proj-list");
        this.addProjectButton = document.getElementById("add-proj");
    }

    onAddProject(callback) {
        this.addProjectButton.addEventListener("click", callback);
    }

    onSelectProject(callback) {
        this.projects.addEventListener("click", callback);
    }

    onEditProject(callback) {
        this.projects.addEventListener("dblclick", () => {
            console.log("project Clicked")
    });
    }

    render(Projects) {
        const projectsList = Sidebar(Projects);   
        this.projects.replaceChildren(this.projects.firstElementChild);
        this.projects.appendChild(projectsList);
    }
}

class MainContentController {

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
            const pId = e.target.dataset[SideBarController.projectDataSetName];
            if(pId) {
                this.selectedProjectId  = pId;
                this.render();
            }
        })

        this.sidebar.onEditProject((e) => {
            const pId = e.target.dataset[SideBarController.projectDataSetName];
            this.modal.getProjectInfo(formData => {
                this.data.addProject(new Project(formData.title, formData.color));
                this.storage.storeData();
                this.render();
            });
        })
    }

    render() {
        this.sidebar.render(this.data.Projects);

    }
}

const app = new AppController().init();
export { SideBarController }