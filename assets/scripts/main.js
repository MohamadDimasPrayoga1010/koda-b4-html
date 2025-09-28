require.config({
  paths: {
    jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min",
    moment:
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min",
    addTask: "./lib/addTask",
    byDate: "./lib/byDate",
    editTask: "./lib/editTask",
    taskComplate: "./lib/taskComplate",
    customCheckbox: "./lib/customCheckbox",
    subtask: "./lib/subtask",
  },
});

require([
  "jquery",
  "addTask",
  "byDate",
  "editTask",
  "taskComplate",
  "customCheckbox",
  "subtask",
], function (
  $,
  addTask,
  byDate,
  editTask,
  taskComplate,
  customCheckbox,
  subtask
) {
  $(document).ready(function () {
    addTask.initToggleForm();
    addTask.renderTasks();
    byDate.initToggleByDate();
    editTask.initToggleEdit();
    editTask.initRenameTask();
    editTask.initDeleteTask();
    taskComplate.initTaskComplate();
    customCheckbox.initCustomCheckbox();
    subtask.initSubtaskToggle();
  });
});
