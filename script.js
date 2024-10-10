// Get references to HTML elements
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// Initialize task data from local storage or an empty array
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

// Function to add or update a task
const addOrUpdateTask = () => {
    // Find the index of the current task in the task data array
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  // Create a new task object
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  // If the task is new, add it to the beginning of the task data array
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } // If the task already exists, update it
  else {
    taskData[dataArrIndex] = taskObj;
  }

  // Save the task data to local storage
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer()
  reset()
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(
    ({ id, title, date, description }) => {
        tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `
    }
  );
};


const deleteTask = (buttonEl) => {
    // Find the index of the task to delete in the task data array
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Remove the task element from the DOM
  buttonEl.parentElement.remove();
  // Remove the task from the task data array
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
}

// Function to edit a task
const editTask = (buttonEl) => {
    // Find the index of the task to edit in the task data array
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Set the current task to the task being edited
  currentTask = taskData[dataArrIndex];

  // Set the input values to the current task
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

 // Update the add or update task button text
  addOrUpdateTaskBtn.innerText = "Update Task";

  // Show the task form
  taskForm.classList.toggle("hidden");  
}

// Function to reset the form
const reset = () => {
    // Reset the add or update task button text
addOrUpdateTaskBtn.innerText = "Add Task";
// Clear the form inputs
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  // Hide the task form
  taskForm.classList.toggle("hidden");
    // Reset the current task
  currentTask = {};
}

// If there are tasks in the task data array, update the task container
if (taskData.length) {
  updateTaskContainer();
}

// Add event listeners to the buttons
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});