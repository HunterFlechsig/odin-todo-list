import "./styles.css";
import ShowProject from "./components/project.js";
import { AppData, Project } from "./classes.js";
import { GetProjectTitle, GetUserName } from "./components/modals.js";
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
    }

    #getFormDataAsObject() {
        const formData = new FormData(this.modalForm);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);
        return formDataObj;
    }

    #useModal(creationfunc, onSubmit) {
        const modal = creationfunc();
        clearAndSet(this.modalForm, modal.fragment);

        const handler = (e) => {
            e.preventDefault();

            const formData = this.#getFormDataAsObject();
            this.modal.close();

            onSubmit(formData);
            this.modalForm.removeEventListener('submit', handler);
        } 

        this.modalForm.addEventListener('submit', handler);
        this.modal.showModal();
    }

    getProjectTitle(onSubmit) {
        this.#useModal(GetProjectTitle, onSubmit);
    }
}

class SideBarController {
    constructor() {
        this.projects = document.querySelector(".proj-list");
        this.addProjectButton = document.getElementById("add-proj");
    }

    onAddProject(callback) {
        this.addProjectButton.addEventListener("click", callback);
    }

    render(Projects) {
        const projectsList = Sidebar(Projects);   
        this.projects.replaceChildren(this.projects.firstElementChild);
        this.projects.appendChild(projectsList);
    }
}

class AppController {
    constructor() {
        this.storage = new DataController();
        this.data = this.storage.data;
        this.modal = new ModalFormController();
        this.sidebar = new SideBarController();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.sidebar.onAddProject(() => {
            this.modal.getProjectTitle(formData => {
                this.data.addProject(new Project(formData.title));
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

