// access element by DOM

const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const completedTask = document.querySelector("#completed-tasks");
const remainingTask = document.querySelector("#remaining-tasks");
const mainInput = document.querySelector("#todo-form input");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
	tasks.map((task) => {
		createTask(task);
	});
}
todoForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const inputValue = mainInput.value;
	if (inputValue == "") {
		return;
	}

	const task = {
		id: new Date().getTime(),
		name: inputValue,
		isCompleted: false,
	};
	tasks.push(task);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	createTask(task);
	todoForm.reset();
	mainInput.focus();
});

todoList?.addEventListener("click", (e) => {
	if (
		e.target.classList.contains("remove-task") ||
		e.target.parentElement.classList.contains("remove-task") ||
		e.target.parentElement.parentElement.classList.contains("remove-task")
	) {
		const taskId = e.target.closest("li").id;
		removeTask(taskId);
	}
});

todoList?.addEventListener("keydown", (e) => {
	if (e.keyCode === 13) {
		e.preventDefault();

		e.target.blur();
	}
});

todoList?.addEventListener("input", (e) => {
	const taskId = e.target.closest("li").id;

	updateTask(taskId, e.target);
});

function createTask(task) {
	const taskEl = document.createElement("li");

	taskEl.setAttribute("id", task.id);

	if (task.isCompleted) {
		taskEl.classList.add("complete");
	}

	const taskElMarkup = `
    <div>
		<input type="checkbox" name="task" id="${task.id}" ${
		task.isCompleted ? "checked" : ""
	} />
		<span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>

	</div>
		<button title="Remove the ${task.name}" class="remove-task">
  
    <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="16.000000pt"
        height="16.000000pt"
        viewBox="0 0 16.000000 16.000000"
        preserveAspectRatio="xMidYMid meet"
    >
        <g transform="translate(0.000000,16.000000) scale(0.100000,-0.100000)" fill="#383838" stroke="none">
            <path d="M17 143 c-4 -3 5 -19 20 -35 l27 -28 -27 -28 c-35 -37 -22 -50 15 -15 l28 27 28 -27 c37 -35 50 -22 15 15 l-27 28 27 28 c35 37 22 50 -15 15 l-28 -27 -28 27 c-16 15 -32 24 -35 20z" />
        </g>
    </svg>
 </button>
    `;

	taskEl.innerHTML = taskElMarkup;

	todoList?.appendChild(taskEl);
	countTasks();
}

// !arrow function can't support function hosting

function countTasks() {
	const completedTaskArray = tasks.filter((task) => task.isCompleted === true);
	totalTasks.textContent = tasks.length;
	completedTask.textContent = completedTaskArray.length;
	remainingTask.textContent = tasks.length - completedTaskArray.length;
}

// remove button function

function removeTask(taskId) {
	tasks = tasks.filter((task) => task.id !== parseInt(taskId));

	localStorage.setItem("tasks", JSON.stringify(tasks));
	document.getElementById(taskId).remove();
	countTasks();
}
function updateTask(taskId, el) {
	const task = tasks.find((task) => {
		return task.id === parseInt(taskId);
	});

	if (el.hasAttribute("contenteditable")) {
		task.name = el.textContent;
	} else {
		const span = el.nextElementSibling;
		const parent = el.closest("li");

		task.isCompleted = !task.isCompleted;
		if (task.isCompleted) {
			span.removeAttribute("contenteditable");
			parent.classList.add("complete");
		} else {
			span.setAttribute("contenteditable", "true");
			parent.classList.remove("complete");
		}
	}
	localStorage.setItem("tasks", JSON.stringify(tasks));
	countTasks();
}
