define(["jquery", "addTask"], function ($, addTask) {
  function initTaskComplate() {
    const $btnTaskComplate = $("#btnTaskComplate");
    const $taskComplate = $("#taskComplate");
    $taskComplate.hide();

    $btnTaskComplate.on("click", function () {
      $taskComplate.toggle();

      const tasks = addTask.loadTasks();
      const completedTasks = tasks.filter((t) => t.completed);
      const count = completedTasks.length;
      const arrowSrc = $taskComplate.is(":visible")
        ? "assets/images/Arrow - Up 2.png"
        : "assets/images/Arrow - Right 2.png";

      $btnTaskComplate.html(`
        <span class="flex items-center gap-2">
          <img src="${arrowSrc}" alt="icon-arrow" class="w-4 h-4"/>
          Terselesaikan (${count} tugas)
        </span>
      `);
    });

    $(document).on("change", "input.task-checkbox", function () {
      const taskId = $(this).data("task-id");
      let tasks = addTask.loadTasks();
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      task.completed = this.checked;
      addTask.saveTasks(tasks);

      addTask.renderTasks();

      renderTaskComplate(tasks);
    });

    $(document).on("change", "input.subtask-checkbox", function () {
      const subtaskId = $(this).data("subtask-id");
      let tasks = addTask.loadTasks();

      let taskFound = null;
      for (let task of tasks) {
        const sub = task.subtasks.find((s) => s.id === subtaskId);
        if (sub) {
          sub.completed = this.checked;
          taskFound = task;
          break;
        }
      }

      if (!taskFound) return;

      taskFound.completed = taskFound.subtasks.every((s) => s.completed);

      addTask.saveTasks(tasks);
      addTask.renderTasks();
      renderTaskComplate(tasks);
    });

    $(document).on(
      "change",
      "#taskComplate input[type='checkbox']",
      function () {
        const taskId = $(this).closest(".task-complate-item").data("task-id");
        let tasks = addTask.loadTasks();
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
        task.completed = false;
        addTask.saveTasks(tasks);
        addTask.renderTasks();
        renderTaskComplate(tasks);
      }
    );

    function renderTaskComplate(tasks) {
      $taskComplate.empty();
      const completedTasks = tasks.filter((t) => t.completed);

      completedTasks.forEach((task) => {
        const html = `
          <div class="flex items-center my-2 task-complate-item w-full" data-task-id="${
            task.id
          }">
            <div class="flex gap-2 items-center">
              <label class="relative cursor-pointer flex items-center gap-2">
                <input type="checkbox" class="sr-only peer" />
                <div class="custom-checkbox w-7 h-7 rounded-full border border-gray-400 peer-checked:bg-[#FF5F26] flex items-center justify-center">
                  <svg class="w-4 h-4 text-white peer-checked:block hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
              <div class="flex flex-col">
                <span class="text-base font-medium text-[#293038] line-through">${
                  task.title
                }</span>
                ${task.desc ? `<div><p>${task.desc}</p></div>` : ""}
              </div>
            </div>
            <button class="ml-auto flex items-center justify-center">
              <img src="assets/images/Arrow - Down 2.svg" alt="icon-arrow" class="w-4 h-4"/>
            </button>
          </div>
        `;
        $taskComplate.append(html);
      });

      const count = completedTasks.length;
      const arrowSrc = $taskComplate.is(":visible")
        ? "assets/images/Arrow - Up 2.png"
        : "assets/images/Arrow - Right 2.png";

      $btnTaskComplate.html(`
        <span class="flex items-center gap-2">
          <img src="${arrowSrc}" alt="icon-arrow" class="w-4 h-4"/>
          Terselesaikan (${count} tugas)
        </span>
      `);
    }
  }

  return {
    initTaskComplate,
  };
});
