const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");

const searchTask = document.getElementById("searchTask");
const filterStatus = document.getElementById("filterStatus");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const saveBtn = document.getElementById("saveBtn");
const clearAll = document.getElementById("clearAll");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editTaskId = null;

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {

    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = tasks.length - completed;

}

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    const search = searchTask.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(search)
    );

    if (filterStatus.value === "completed") {

        filteredTasks = filteredTasks.filter(task => task.completed);

    }

    if (filterStatus.value === "pending") {

        filteredTasks = filteredTasks.filter(task => !task.completed);

    }

    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            `<div class="empty">
                No Tasks Found
            </div>`;

        updateStats();

        return;

    }

    filteredTasks.forEach(task => {

        const div = document.createElement("div");

        div.className = `task-item ${task.completed ? "completed" : ""}`;

        div.innerHTML = `

            <div class="task-title">

                <h3>${task.title}</h3>

            </div>

            <p class="task-description">

                ${task.description || "No Description"}

            </p>

            <div class="task-meta">

                <span class="badge ${task.priority.toLowerCase()}">

                    ${task.priority}

                </span>

                <span>

                    📅 ${task.date || "No Due Date"}

                </span>

            </div>

            <div class="actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask('${task.id}')">

                    ${task.completed ? "Undo" : "Complete"}

                </button>

                <button
                    class="edit-btn"
                    onclick="editTask('${task.id}')">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task.id}')">

                    Delete

                </button>

            </div>

        `;

        taskList.appendChild(div);

    });

    updateStats();

}
 
taskForm.addEventListener("submit", function (e) {

    e.preventDefault();

    if (taskTitle.value.trim() === "") {

        alert("Task Title is Required");

        return;

    }

    if (editTaskId) {

        const task = tasks.find(t => t.id === editTaskId);

        task.title = taskTitle.value;
        task.description = taskDescription.value;
        task.priority = taskPriority.value;
        task.date = taskDate.value;

        editTaskId = null;

        saveBtn.textContent = "Add Task";

    }

    else {

        tasks.push({

            id: Date.now().toString(),

            title: taskTitle.value,

            description: taskDescription.value,

            priority: taskPriority.value,

            date: taskDate.value,

            completed: false

        });

    }

    saveTasks();

    renderTasks();

    taskForm.reset();

});

function deleteTask(id) {

    if (!confirm("Delete this task?")) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

}

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    task.completed = !task.completed;

    saveTasks();

    renderTasks();

}

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    taskTitle.value = task.title;

    taskDescription.value = task.description;

    taskPriority.value = task.priority;

    taskDate.value = task.date;

    editTaskId = id;

    saveBtn.textContent = "Update Task";

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

searchTask.addEventListener("keyup", renderTasks);

filterStatus.addEventListener("change", renderTasks);

clearAll.addEventListener("click", () => {

    if (!tasks.length) return;

    if (confirm("Delete all tasks?")) {

        tasks = [];

        saveTasks();

        renderTasks();

    }

});

renderTasks();
