var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContenteEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#task-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

/**
 * taskFormHandler
 * @param {*} event
 * @returns
 */
var taskFormHandler = function (event) {
  event.preventDefault();

  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check if input values are emtpy strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  formEl.reset();

  //check if we are editing an old task
  var isEdit = formEl.hasAttribute("data-task-id");
  //has data attribute, so get task id and call funciton to complete edit porcess
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // create new task because no data attribute, create normal obj
  else {
    //package up data
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
    };

    //send it as an argument ot createTaskEl
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  //create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  //give it a class name
  taskInfoEl.className = "task-info";

  //add HTML content to div
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  // add entire list ot item to list
  tasksToDoEl.appendChild(listItemEl);

  //increate task counter for next unique ID
  taskIdCounter++;
};

var completeEditTask = function (taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  //set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};
/**
 *
 * @param {*} taskId
 * @returns
 */
var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var status of statusChoices) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = status;
    statusOptionEl.setAttribute("value", status);

    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

/**
 *
 * @param {*} event
 */
var taskButtonHandler = function (event) {
  var eventTarget = event.target;
  // edit button is clicked
  if (eventTarget.matches(".edit-btn")) {
    editTask(eventTarget.getAttribute("data-task-id"));
  }
  // delete button is clicked
  else if (eventTarget.matches(".delete-btn")) {
    // get the elements task id
    var taskId = eventTarget.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var editTask = function (taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  console.log(taskSelected);
  //get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};
/**
 *
 * @param {*} taskId
 */
var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

var taskStatusChangeHandler = function (event) {
  //get task item's id
  var taskId = event.target.getAttribute("data-task-id");
  //get the current select option's value and voert to lowercase
  var statusValue = event.target.value.toLowerCase();

  //find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
};
/**
 * Main Program
 */
formEl.addEventListener("submit", taskFormHandler);
pageContenteEl.addEventListener("click", taskButtonHandler);
pageContenteEl.addEventListener("change", taskStatusChangeHandler);
