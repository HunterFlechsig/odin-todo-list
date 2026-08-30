import "./styles/styles.css";
import { Project, Todo } from "./controllers/dataClasses.js";
import Sidebar from "./components/sidebar.js";
import { MyDay, AllTasks } from "./components/lists.js";
import Data from "./controllers/data.js";
import * as utils from "./controllers/utilities.js";
import Modal from "./controllers/modal.js";
import Main from "./components/main.js";

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
        this.bindEvents();
    }

    #viewActions = {
        project : (data) => {
            const { selectedProject, projects } = data;
            const task = this.selectedTodoId ? selectedProject.getTodo(this.selectedTodoId) : {};

            console.log("task", this.selectedTodoId, task);

            return Main(selectedProject, projects, task);
        },

        myDay: () => {
            return MyDay();
        },

        allTasks: () => {
            return AllTasks();
        },

        add: () => {
            this.selectedTodoId = null;
            this.render(this.view)
        },

        show: (id) => {
            console.log("setting selectedTodoId")
            this.selectedTodoId = id;
            this.render(this.view)
        }
    }

    bindEvents() {
        this.content.addEventListener("click", (e) => {
            const action = e.target.closest("[data-action]");       
            const id = e.target.closest("[id]").id;    
            if(!action || !id) return;

            this.#viewActions[action.dataset.action](id);            
        })
    }

    onAction(callback) {
        this.content.addEventListener("submit", (e) => {
            const checkEmpty = () => {
                const form = document.getElementById("create-task-form");
                const taskData = utils.getFormDataAsObject(form);
                return taskData.title === "" ? false : taskData; 
            }

            if(!this.selectedTodoId) {
                const taskData = checkEmpty()
                if(taskData) {
                    callback({
                        action: 'create-task',
                        data: {
                            taskData: taskData,
                            project: this.data.selectedProject,
                        }
                    })
                }
            };
        })
        // this.content.addEventListener("focusout", (e) => {
        //     const action = e.target.dataset["action"];
        //     if(!action) return;

        //     const checkEmpty = () => {
        //         const form = document.getElementById("create-task-form");
        //         const taskData = utils.getFormDataAsObject(form);
        //         return taskData.title === "" ? false : taskData; 
        //     }

        //     // const id = e.target.closest("[data-taskId]");
        //     // const form = document.getElementById("create-task-form");
        //     // const taskData = utils.getFormDataAsObject(form);

        //     if(!this.selectedTodoId) {
        //         const taskData = checkEmpty()
        //         console.log("task data: ", taskData)
        //         if(taskData) {
        //             callback({
        //                 action: 'create-task',
        //                 data: {
        //                     taskData: taskData,
        //                     project: this.data.selectedProject,
        //                 }
        //             })

        //             this.selectedTodoId = taskData.id;
        //         }
        //     };
        // })
    }

    #reRender() {

    }

    render(view) {
        this.view = view //save for rerendering only main
        console.log("render main", view);
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

    #viewActions = {
        ["create-task"]: (data) => {
            const { title, desc, dueDate, priority, status } = data.taskData;
            const project = data.project;
            console.log("created task", project);
            project.addTodo(new Todo(title, desc, dueDate, priority, status));
            this.storage.storeData();
        }
    }

    init() {
        this.render();
        this.bindEvents();
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

        this.main.onAction((action) => {
            console.log(action);
            this.#viewActions[action.action](action.data);
            this.render();
        })
    }

    render() {
        this.sidebar.render(this.data.Projects);
        this.main.render(this.view);
    }
}

const app = new AppController().init();