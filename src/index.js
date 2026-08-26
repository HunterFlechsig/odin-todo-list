import "./styles.css";
import ShowProject from "./components/project.js";
import { AppData, Project } from "./classes.js";
import { GetUserName } from "./components/modals.js";

class DataController {
    static DATA_KEY = "data"

    storeData = () => {
        localStorage.setItem("data",JSON.stringify(this.data));
        console.log(`Storing data: ${this.data}`)
    }

    getData = () => {
        if(!this.data) return new Error("No Data");

        const localData = localStorage.getItem("data");
        this.data = AppData.fromJSON(JSON.parse(localData));
        return this.data;
    }

    createAppData = (username) => {
        this.data = new AppData(username);
        this.storeData();
    }

    isData = () => {
       if(this.data || localStorage.getItem("data")) {
            return true;
       }
    }
}

function clearAndSet(element, fragment) {
    element.replaceChildren();
    element.appendChild(fragment);
}

function getFormDataAsObject(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

class ModalFormController {
    constructor(DataController) {
        this.data = DataController
        this.modal = document.getElementById("dialog");
        this.modalForm = document.getElementById("dialog-form");
    }

    getUsername(onSubmit) {
        clearAndSet(this.modalForm, GetUserName());

        const handler = (e) => {
            e.preventDefault();

            const formData = getFormDataAsObject(this.form);
            this.modal.close();

            onSubmit(formData.username);
        }

        this.modalForm.addEventListener('submit', handler);
        this.modal.showModal();
    }
}


const ScreenController = (() => {
    const data = new DataController();
    const model = new ModalFormController();

    if(!data.isData()) {
       model.getUsername(username => data.createAppData(username));
    }

    const updateSideBar = () => {
        
    }

    const showProject = () => {

    }
    
})();