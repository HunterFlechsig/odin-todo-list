import "./styles/styles.css";
import ShowProject from "./components/project.js";
import { Project, Todo } from "./controllers/dataClasses.js";
import { GetDeleteConfirmation, GetProjectInfo } from "./components/modals.js";
import Sidebar from "./components/sidebar.js";
import { MyDay, AllTasks } from "./components/lists.js";
import CreateTask from "./components/createTask.js";
import Data from "./controllers/data.js";
import * as utils from "./controllers/utilities.js";
import Modal from "./controllers/modal.js";

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
    }

    #viewActions = {
        project : (project) => {
            const fragement = document.createDocumentFragment();
            fragement.append(ShowProject(project), CreateTask());
            return fragement;
        },

        myDay: () => {
            return MyDay();
        },

        allTasks: () => {
            return AllTasks();
        }
    }
  

    render(view) {
        console.log("view" , view);
        utils.clearAndSet(this.content, this.#viewActions[view.type](view.data));
    }
}

class AppController {
    constructor() {
        this.storage = new Data();
        this.data = this.storage.data;
        this.modal = new Modal();
        this.sidebar = new SideBarController(this.data.defualtProject.id);
        this.main = new MainContentController();

        this.view = {
            type: "project",
            data: this.data.defualtProject,
        }
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
            this.view = {
                type: "project",
                data: this.data.getProject(id),
            }
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
        this.main.render(this.view);
    }
}

const app = new AppController().init();