function MyDay() {
    const tasks = document.createElement("h1");
    tasks.textContent = "My Tasks";

    return tasks;
}

function AllTasks() {
    const tasks = document.createElement("h1");
    tasks.textContent = "All Tasks";

    return tasks;
}

export { MyDay, AllTasks };