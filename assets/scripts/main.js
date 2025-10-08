import { initToggleForm, renderTasks } from "./lib/addTask.js";
import { initToggleByDate } from "./lib/byDate.js";
import {
  initToggleEdit,
  initRenameTask,
  initDeleteTask,
} from "./lib/editTask.js";
import { initTaskComplate } from "./lib/taskComplate.js";
import { initCustomCheckbox } from "./lib/customCheckbox.js";
import { initSubtaskToggle } from "./lib/subtask.js";

$(document).ready(function () {
  initToggleForm();
  renderTasks();
  initToggleByDate();
  initToggleEdit();
  initRenameTask();
  initDeleteTask();
  initTaskComplate();
  initCustomCheckbox();
  initSubtaskToggle();
});
