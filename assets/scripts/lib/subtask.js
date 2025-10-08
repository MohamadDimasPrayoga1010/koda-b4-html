import { loadTasks, saveTasks, renderTasks } from "./addTask.js";

export function initSubtaskToggle() {
  $(document).on("click", ".btn-toggle-subtask", function () {
    const taskId = $(this).data("task-id");
    const $subtask = $(`.subtask[data-task-id='${taskId}']`);
    const $arrow = $(this).find(".iconSubtask");

    $subtask.toggle();
    $arrow.attr(
      "src",
      $subtask.is(":visible")
        ? "/assets/images/Arrow - Up 2.png"
        : "/assets/images/Arrow - Down 2.svg"
    );
  });

  $(document).on("click", ".add-subtask-btn", function () {
    const taskId = $(this).data("task-id");
    const $subtaskSection = $(`.subtask[data-task-id='${taskId}']`);

    if ($subtaskSection.find(".new-subtask-input").length) return;

    const inputHtml = `
      <div class="flex items-center gap-2 mt-3 new-subtask-input">
        <input type="text" class="w-full border px-2 py-1 rounded text-sm" placeholder="Tulis subtask..." />
        <button class="save-subtask-btn bg-[#ff5f26] text-white px-3 py-1 rounded" data-task-id="${taskId}">Simpan</button>
      </div>
    `;
    $subtaskSection.append(inputHtml);
  });

  $(document).on("click", ".save-subtask-btn", async function () {
    const taskId = $(this).data("task-id");
    const $subtaskSection = $(`.subtask[data-task-id='${taskId}']`);
    const $input = $subtaskSection.find(".new-subtask-input input");
    const title = $input.val().trim();

    if (!title) {
      alert("Isi nama subtask dulu cuy");
      return;
    }

    let tasks = loadTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newSubtask = {
      id: Date.now(),
      title,
      completed: false,
    };

    task.subtask.push(newSubtask);
    saveTasks(tasks);
    renderTasks();

    $subtaskSection.find(".new-subtask-input").remove();
  });

  $(document).on("change", ".subtask-checkbox", async function () {
    const taskId = $(this).closest(".subtask").data("task-id");
    const subtaskId = $(this).data("subtask-id");

    let tasks = loadTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const sub = task.subtask.find((s) => s.id === subtaskId);
    if (sub) sub.completed = this.checked;

    saveTasks(tasks);
    renderTasks();
  });


  $(document).on(
    "change",
    ".subtask-checkbox, #new-task, input[type='checkbox']",
    function () {
      if (this.checked) {
        this.style.backgroundImage = "url('assets/images/check-white.svg')";
        this.style.backgroundSize = "80%";
        this.style.backgroundRepeat = "no-repeat";
        this.style.backgroundPosition = "center";
        this.style.backgroundColor = "#ff5f26";
        this.style.borderColor = "#ff5f26";
      } else {
        this.style.backgroundImage = "none";
        this.style.backgroundColor = "transparent";
        this.style.borderColor = "gray";
      }
    }
  );
}
