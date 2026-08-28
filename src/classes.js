class storageItem {
    fromJSON() {
        throw console.error("Must implement a fromJSON function");
        
    }
}

class Todo extends storageItem {
    static STATUS = {
        DONE: 'done',
        OPEN: 'open',
    }

    static PRIORITY = {
        P1: 1,
        P2: 2,
        P3: 3,
        P4: 4,
    }

    //TODO: need to update date fromat or something
    constructor(title, desc="", dueDate=new Date(), priority = Todo.PRIORITY.P3, status = Todo.STATUS.OPEN) {
        super();
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status
        this.id = crypto.randomUUID();
    }

    isOverDue() {
        return new Date() > this.dueDate
    }

    static fromJSON(data) {
        const {title, desc, dueDate, priority, status} = data
        const todo = new Todo(title, desc, dueDate, priority, status);
        todo.id = data.id;
        return todo;
    }
}

class Project extends storageItem{
    constructor(name, color) {
        super();
        this.name = name;
        this.color = color;
        this.id = crypto.randomUUID();
        this.todos = [];
    }
    
    update(name, color) {
        this.name = name;
        this.color = color;
    }

    addTodo(todo) {   
        this.todos.push(todo);
    }

    static isEqual(Project1, Project2) {
        return Project1.id === Project2.id;
    }

    static fromJSON(data) {
        const project = new Project(data.name, data.color);
        project.id = data.id;
        console.log("fromJSON proj", data);
        project.todos = data.todos.map(Todo.fromJSON);
        return project;
    }
}

class AppData extends storageItem {
    constructor() {
        super();
        this.Projects = [];
        const personalProj = new Project("Personal", "var(--clr-primary-purple)");
        this.addProject(personalProj);
        this.defualtProject = personalProj;
    }

    setDefualtProject(id) {
        const proj = this.getProject(id);
        if(proj.id === this.defualtProject.id) return;
   

        this.deleteProject(id);
        this.defualtProject = proj.id;
        this.Projects.unshift(proj)
    }

    #projectExists(project) {
        return this.Projects.find(proj => proj.name === project.name)
    }

    addProject(project) {
        if(this.#projectExists(project)) return false;
        
        this.Projects.push(project);
        return true;
    }

    getProject(id) {
        return this.Projects.find(project => project.id === id)
    }

    getTodaysTasks() {
        return {};
    }

    getAllTasks() {
        return {};
    }

    updateProject(id, name, color) {
        const project = this.getProject(id);
        project.update(name,color);
    }

    deleteProject(id) {
        if(id === this.defualtProject.id) return false;

        this.Projects = this.Projects.filter(project => project.id !== id);
        return true;
    }

    static fromJSON(data) {
        const appData = new AppData();
        appData.Projects = data.Projects.map(Project.fromJSON);
        return appData;
    }
}

export { Project, Todo, AppData }