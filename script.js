const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const filterSelect = document.getElementById("filter");
const taskCounter = document.getElementById("taskCounter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

addBtn.addEventListener("click", addTask);
filterSelect.addEventListener("change", renderTasks);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Digite uma tarefa válida!");
        return;
    }

    const task = {
        id: Date.now(),
        text,
        priority: prioritySelect.value,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

function renderTasks() {
    taskList.innerHTML = "";

    const filter = filterSelect.value;

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `${task.priority} ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <span onclick="toggleTask(${task.id})">${task.text}</span>
            <div class="actions">
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="removeTask(${task.id})">✖</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateCounter();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    taskCounter.textContent =
        `${completed}/${total} tarefas concluídas`;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}