import { loadTasks, saveTasks, renderTasks } from "./addTask.js";

export function initToggleEdit() {
  $(document).on("click", ".btnEdit", function (e) {
    e.stopPropagation();

    const $btnEdit = $(this);
    const $taskItem = $btnEdit.closest(".task-item");
    const $editTask = $taskItem.find(".editTask");
    const $iconMore = $btnEdit.find("img");

    $editTask.toggle();

    $iconMore.attr(
      "src",
      $editTask.is(":visible")
        ? "/assets/images/more-vertical-color.png"
        : "/assets/images/more-vertical.png"
    );

    $(".editTask").not($editTask).hide();
    $(".btnEdit img")
      .not($iconMore)
      .attr("src", "/assets/images/more-vertical.png");
  });

  $(document).on("click", function (e) {
    if ($(e.target).closest(".inline-rename").length === 0) {
      $(".editTask").hide();
      $(".btnEdit img").attr("src", "/assets/images/more-vertical.png");
    }
  });
}

export function initRenameTask() {
  $(document).on("click", ".rename-task", function (e) {
    e.stopPropagation();

    const taskId = $(this).data("task-id");
    const $taskItem = $(`.task-item[data-task-id='${taskId}']`);
    const $taskTitle = $taskItem.find(".taskTitle");

    const currentTitle = $taskTitle.text();
    const $input = $(
      `<input type="text" class="inline-rename" autocomplete="off" value="${currentTitle}" />`
    );
    $taskTitle.replaceWith($input);
    $input.focus();

    async function saveRename() {
      const newTitle = $input.val().trim();
      if (!newTitle) {
        alert("Nama task tidak boleh kosong");
        $input.focus();
        return;
      }

      const tasks = loadTasks();
      const task = tasks.find((t) => t.id == taskId);
      if (task) {
        task.title = newTitle;
        saveTasks(tasks);
        renderTasks();
      }
    }

    $input.on("keydown", function (e) {
      if (e.key === "Enter") saveRename();
    });

    $input.on("blur", function () {
      setTimeout(saveRename, 100);
    });
  });
}

export function initDeleteTask() {
  $(document).on("click", ".delete-task", async function (e) {
    e.stopPropagation();

    const taskId = $(this).data("task-id");
    let tasks = loadTasks();
    tasks = tasks.filter((t) => t.id != taskId);
    saveTasks(tasks);

    renderTasks();
  });
}
