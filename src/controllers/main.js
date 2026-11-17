import * as Utils from "./utilities.js"
import Main from "../components/main.js";
import { MyDay, AllTasks } from "../components/lists.js";
import { data, storage } from "./data.js";
import { Todo } from "./dataClasses.js";

export default class MainController {
    static inputId = "task-input";

    constructor() {
        this.content = document.querySelector(".content");
        this.bindEvents();
    }

    #mainActions = {
        project : (data) => {
            const { selectedProject, projects } = data;
            const task = this.selectedTodoId ? selectedProject.getTodo(this.selectedTodoId) : {};

            return Main(selectedProject, projects, task);
        },

        myDay: (viewData) => {
            return MyDay(viewData.todos);
        },

        allTasks: (viewData) => {
            return AllTasks(viewData.todos);
        },

        add: () => {
            this.selectedTodoId = null;
        },

        show: (id) => {
            this.selectedTodoId = id;

        },

        change:(id) => {
            const project = this.view.data.selectedProject
                || data.Projects.find(p => p.getTodo(id));
            if (project) {
                project.updateTodoStatus(id);
                storage.storeData();
            }
        },

        delete:(id) => {
            const project = this.view.data.selectedProject
                || data.Projects.find(p => p.getTodo(id));
            if (project) {
                project.deleteTodo(id);
                storage.storeData();
            }
        }
    }

    bindEvents() {
        const checkEmpty = () => {
            const form = document.getElementById("create-task-form");
            const taskData = Utils.getFormDataAsObject(form);
            return taskData.title === "" ? false : taskData; 
        }

        this.content.addEventListener("click", (e) => {
            const action = e.target.closest("[data-main-action]");  
            const id = e.target.closest("[id]"); 
            if(!action || !id) return;

            this.#mainActions[action.dataset["mainAction"]](id.id);          
            this.render(this.view)  
        })

        this.content.addEventListener("submit", (e) => {
            // e.preventDefault()
            const taskData = checkEmpty()
            if(!this.selectedTodoId && taskData) {
                const { title, desc, dueDate, priority, status } = taskData;
                const project = this.view.data.selectedProject
                
                project.addTodo(new Todo(title, desc, dueDate, priority, status));
                storage.storeData();
                this.render(this.view)
            };

            if(this.selectedTodoId && taskData) {
                const { title, desc, dueDate, priority, status } = taskData;
                const newProjId = taskData.project;
                const oldProjId = this.view.data.selectedProject.id
                const taskId = this.selectedTodoId

                data.updateTodo(oldProjId, newProjId, taskId, new Todo(title, desc, dueDate, priority, status));
                storage.storeData();
                this.render(this.view)
            }
        })
    }

    render(view) {
        this.view = view //save for rerendering only main
        Utils.clearAndSet(this.content, this.#mainActions[view.type](view.data));
    }
}