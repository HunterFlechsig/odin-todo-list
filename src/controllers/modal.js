import { GetProjectInfo, GetDeleteConfirmation } from "../components/modals.js";
import * as utils from "./utilities.js"

// render forms and send data back
export default class Modal {
    constructor() {
        this.modal = document.getElementById("dialog");
        this.modalForm = document.getElementById("dialog-form");
        this.data = {};
    }

    onAction(callback) {
        this.modalForm.addEventListener("submit", (e) => {
            e.preventDefault();

            this.data["formData"] = utils.getFormDataAsObject(e.target)

            callback({
                action: this.action,
                data: this.data,
            });
            this.modal.close();
        });        
    }

    // takes a function to create form, data to fill the form in, 
    // a callback to do something with data recieved
    #useModal(creationfunc, data) {
        console.log("using modal")
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
        console.log(state);
        this.action = state.action;
        this.#modalAction[state.action](state.data);
    }

}