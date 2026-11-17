import { Todo } from "../controllers/dataClasses.js";

function TaskListView(title, items) {
    const fragment = document.createDocumentFragment();

    const heading = document.createElement('h1');
    heading.textContent = title;

    const div = document.createElement('div');
    div.classList.add('main');

    if (items.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = title === "My Day" ? "No tasks due today" : "No tasks yet";
        empty.style.color = "var(--txt-clr-secondary)";
        div.appendChild(empty);
    } else {
        const ul = document.createElement("ul");

        items.forEach(({ todo, projectName, projectColor }) => {
            const item = document.createElement("li");
            item.id = todo.id;
            item.classList.add("todo-item");

            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = todo.status === Todo.STATUS.DONE;
            input.dataset["mainAction"] = "change";
            label.append(input);

            const text = document.createElement("span");
            text.textContent = todo.title;
            if (todo.status === Todo.STATUS.DONE) {
                text.style.textDecoration = "line-through";
            }

            const projectTag = document.createElement("span");
            projectTag.classList.add("project-tag");

            const dot = document.createElement("span");
            dot.classList.add("project-color");
            dot.style.background = projectColor;

            const projName = document.createElement("span");
            projName.textContent = projectName;
            projectTag.append(dot, projName);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.style.display = todo.status === Todo.STATUS.DONE ? "block" : "none";
            deleteBtn.dataset["mainAction"] = "delete";

            item.append(label, text, projectTag, deleteBtn);
            ul.appendChild(item);
        });

        div.appendChild(ul);
    }

    fragment.append(heading, div);
    return fragment;
}

function MyDay(todos) {
    return TaskListView("My Day", todos);
}

function AllTasks(todos) {
    return TaskListView("All Tasks", todos);
}

export { MyDay, AllTasks };
