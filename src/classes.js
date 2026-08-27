class storageItem {
    fromJSON() {
        throw console.error("Must implement a fromJSON function");
        
    }
}

class TodoItem extends storageItem {
    static STATUS = {
        DONE: 'done',
        OPEN: 'open',
    }

    static PRIORITY = {
        P1: 'p1',
        P2: 'p2',
        P3: 'p3',
        P4: 'p4',
    }

    //TODO: need to update date fromat or something
    constructor(title, desc, dueDate, priority, status) {
        super();
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status
        this.id = crypto.randomUUID();
    }

    updateTodo(title, desc, dueDate, priority) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status
    }

    isOverDue() {
        return new Date() > this.dueDate
    }

    static fromJSON(data) {
        const todo = new TodoItem(
            data.title,
            data.desc,
            new Date(data.dueDate),
            data.priority,
            data.status
        );

        todo.id = data.id;
        return todo;
    }
}

class TodoList extends storageItem {
    constructor() {
        super();
        this.todos = [];
    }

    addTodo(todoItem) {
        this.todos.push(todoItem);
    }

    updateTodos(id, todoItem) {
        const todo = this.todos.find(item => item.id === id);
        if(todo) todo = todoItem;
    }

    removeTodo(id) {
        this.todos = this.todos.filter(item => item.id !== id)
    }

    static fromJSON(data) {
        const todoList = new TodoList();
        todoList.todos = data.todos.map(TodoItem.fromJSON);
        return todoList
    }
}


class Project extends storageItem{
    constructor(name, color) {
        super();
        this.name = name;
        this.color = color;
        this.id = crypto.randomUUID();
        this.TodoList = new TodoList();
    }
    
    update(name, color) {
        this.name = name;
        this.color = color;
    }

    static isEqual(Project1, Project2) {
        return Project1.id === Project2.id;
    }

    static fromJSON(data) {
        const project = new Project(data.name, data.color);
        project.id = data.id;
        project.TodoList = TodoList.fromJSON(project.TodoList);
        return project
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
        if(Project.isEqual(proj, this.defualtProject)) return;
   

        this.deleteProject(id);
        this.defualtProject = proj;
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

export { Project, TodoItem, AppData }