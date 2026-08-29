import "./styles/styles.css";
import ShowProject from "./components/project.js";
import { Project, Todo } from "./controllers/dataClasses.js";
import { GetDeleteConfirmation, GetProjectInfo } from "./components/modals.js";
import Sidebar from "./components/sidebar.js";
import { MyDay, AllTasks } from "./components/lists.js";
import CreateTaskInput from "./components/TaskCreate.js";
import DataController from "./controllers/dataController.js";
import * as utils from "./controllers/utilities.js";

// render forms and send data back
class ModalController {
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
        utils.clearAndSet(this.modalForm, modal.fragment);
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

// render and controll sidebar 
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
            const id = e.target.closest("li").id;

            if(id) this.selectedItemId = id;
            if(!sidebarItem) return;

            callback({
                action: sidebarItem.dataset.action,
                id: id,
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

class MainContentController {
    static inputId = "task-input";

    constructor() {
        this.content = document.querySelector(".content");
        this.createTask = CreateTaskInput(MainContentController.inputId);
    }

    #viewActions = {
        project : (project) => {
            return ShowProject(project, this.createTask);
        },

        myDay: () => {
            return MyDay();
        },

        allTasks: () => {
            return AllTasks();
        }
    }

    // onCreateTask(callback) {
    //     this.createTask.addEventListener("submit", (e) => {
    //         e.preventDefault();
    //         const data = utils.getFormDataAsObject(e.target);
    //         console.log("on create teask", data);
    //         if(!data.title) return;
    //         callback(data);
    //     })
    // }    

    render(view) {
        console.log(view);
        if(!(view.type in this.#viewActions)) throw new Error(`View ${view.type} type doesnt Exist`)
        utils.clearAndSet(this.content, this.#viewActions[view.type](view.data));
    }
}

class AppController {
    constructor() {
        this.storage = new DataController();
        this.data = this.storage.data;
        this.modal = new ModalController();
        this.sidebar = new SideBarController(this.data.defualtProject.id);
        this.main = new MainContentController();

        console.log(this.data.defualtProject);
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
        },

        ["show"]: (id) => {
            console.log("Show something on main");
        }
    }

    #ModalAction = {
        ["add-project"] : (data) => {
            const { title, color } = data.formData
            this.data.addProject(new Project(utils.capatalize(title), color));
            this.storage.storeData();
        },

        ["edit-project"] : (data) => {
            const { formData, projectId } = data;
            const { title, color } = formData;
            this.data.updateProject(projectId, title, color);
        },

        ["delete"] : (data) => {
            const { projectId } = data.projectId;
            this.data.deleteProject(projectId);
        }
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.sidebar.onAction((action) => {
            console.log(action);
            this.#sideBarAction[action.action](action.id);
            this.render();
        })

        this.modal.onAction((action) => {
            console.log(action);
            this.#ModalAction[action.action](action.data);
            this.render();
        })

        // this.main.onCreateTask((formData) => {
        //     const todo = new Todo(formData.title);
        //     this.data.getProject(this.view.projectId).addTodo(todo);
        //     this.storage.storeData();
        // })
    }

    render() {
        this.sidebar.render(this.data.Projects);
        // this.main.render(this.view);
    }
}

const app = new AppController().init();
export { SideBarController }