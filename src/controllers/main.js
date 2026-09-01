import * as Utils from "./utilities.js"
import Main from "../components/main.js";
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
            const task = this.selectedTodoId ? selectedProject.getTodo(this.selectedTodoId) : selectedProject.getFirstTodo();
            console.log("first-todo",selectedProject);

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
            this.selectedTodoId = id;
            this.render(this.view)
        },

        ["create-task"]: (taskData, project) => {
            const { title, desc, dueDate, priority, status } = taskData;
            
            project.addTodo(new Todo(title, desc, dueDate, priority, status));
            storage.storeData();
            this.render(this.view)
        },

        ["edit-task"]: (taskData, oldProjId, taskId) => {
            const { title, desc, dueDate, priority, status } = taskData;
            console.log("edit-task", taskData);
            const newProjId = taskData.project;

            data.updateTodo(oldProjId, newProjId, taskId, new Todo(title, desc, dueDate, priority, status));
            storage.storeData();
            this.render(this.view)
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
            if(!action || !action.id) return;

            this.#mainActions[action.dataset["mainAction"]](action.id);            
        })

        this.content.addEventListener("submit", (e) => {
            e.preventDefault()
            
            if(!this.selectedTodoId) {
                const taskData = checkEmpty()
                if(taskData) {
                    this.#mainActions["create-task"](taskData, this.view.data.selectedProject)
                }
            };

            if(this.selectedTodoId) {
                const taskData = checkEmpty()
                if(taskData) {
                    this.#mainActions['edit-task'](taskData, this.view.data.selectedProject.id, this.selectedTodoId)
                }
            };
        })
    }

    render(view) {
        this.view = view //save for rerendering only main
        Utils.clearAndSet(this.content, this.#mainActions[view.type](view.data));
    }
}