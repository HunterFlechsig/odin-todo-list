import { GetProjectInfo, GetDeleteConfirmation } from "../components/modals.js";
import * as utils from "./utilities.js"
import { data, storage } from "./data.js";
import { Project } from "./dataClasses.js";

// render forms and send data back
export default class Modal {
    constructor() {
        this.modal = document.getElementById("dialog");
        this.modalForm = document.getElementById("dialog-form");
        this.data = {};
    }

    #updateAction = {
        ["add-project"] : (d) => {
            const { title, color } = d.formData
            data.addProject(new Project(utils.capatalize(title), color));
            storage.storeData();
        },

        ["edit-project"] : (d) => {
            const { formData, projectId } = d;
            const { title, color } = formData;
            data.updateProject(projectId, title, color);
            storage.storeData();
        },

        ["delete"] : (d) => {
            const { projectId } = d.projectId;
            data.deleteProject(projectId);
            storage.storeData();
        }
    }

    onAction(callback) {
        this.modalForm.addEventListener("submit", (e) => {
            e.preventDefault();

            this.data["formData"] = utils.getFormDataAsObject(e.target)
            this.#updateAction[this.action](this.data)

            callback();
            this.modal.close();
        });        
    }

    // takes a function to create form, data to fill the form in, 
    // a callback to do something with data recieved
    #useModal(creationfunc, data) {
        const modal = creationfunc(data);
        if(this.modalForm.firstElementChild) this.modalForm.replaceChildren(this.modalForm.firstElementChild);
        this.modalForm.append(modal.fragment);
        this.modal.showModal();
    }

    #modalAction = {
        ["close"] : () => {
            this.modal.close();
        },

        ["add-project"] : () =>{
           this.#useModal(GetProjectInfo, {})
        },

        ["edit-project"] : (data) =>{
           this.#useModal(GetProjectInfo, data.project)
           this.data["projectId"] = data.project.id
        },

        ["delete"] : (data) => {
            this.#useModal(GetDeleteConfirmation)
            this.data["projectId"] = data.project.id
        }
    }

    open(state) {
        this.action = state.action;
        this.#modalAction[state.action](state.data);
    }

}