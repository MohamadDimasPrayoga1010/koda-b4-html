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
          <img src="${arrowSrc}" alt="icon-arrow" class="w-5 h-5"/>
          Terselesaikan (${count} tugas)
        </span>
      `);
    });

    $(document).on("change", ".task-checkbox", function () {
      const taskId = $(this).data("task-id");
      let tasks = addTask.loadTasks();
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      task.completed = this.checked;
      addTask.saveTasks(tasks);

      addTask.renderTasks();
      renderTaskComplate();
    });

    $(document).on("change", ".subtask-checkbox", function () {
      const subtaskId = $(this).data("subtask-id");
      const taskId = $(this).closest(".subtask-item").data("task-id");
      let tasks = addTask.loadTasks();

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const subtask = (task.subtask || []).find((s) => s.id === subtaskId);
      if (!subtask) return;

      subtask.completed = this.checked;

      if (task.subtask && task.subtask.length > 0) {
        task.completed = task.subtask.every((s) => s.completed);
      }

      addTask.saveTasks(tasks);
      addTask.renderTasks();
      renderTaskComplate();
    });

    $(document).on(
      "change",
      "#taskComplate .task-complete-checkbox",
      function () {
        const taskId = $(this).closest(".task-complate-item").data("task-id");
        let tasks = addTask.loadTasks();
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        task.completed = false;

        if (task.subtask && task.subtask.length > 0) {
          task.subtask.forEach((sub) => {
            sub.completed = false;
          });
        }

        addTask.saveTasks(tasks);
        addTask.renderTasks();
        renderTaskComplate();
      }
    );

    function renderTaskComplate() {
      const tasks = addTask.loadTasks();
      $taskComplate.empty();
      const completedTasks = tasks.filter((t) => t.completed);

      completedTasks.forEach((task) => {
        const html = `
          <div class="flex justify-between items-center my-2 task-complate-item w-full" data-task-id="${
            task.id
          }">
            <div class="flex gap-2 items-center">
              <label class="relative cursor-pointer flex items-center gap-2" >
                <input type="checkbox" class="sr-only peer task-complete-checkbox" checked />
                <div class="custom-checkbox w-7 h-7 rounded-full border border-gray-400 peer-checked:bg-[#FF5F26] flex items-center justify-center">
                  <svg class="checkmark-complete w-4 h-4 text-white" style="display: block;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
              <div class="flex flex-col ml-2">
                <span class="text-base font-medium text-[#293038] line-through">${
                  task.title
                }</span>
                ${
                  task.desc
                    ? `<span class="text-sm text-[#7a7f83] line-through">${task.desc}</span>`
                    : ""
                }
              </div>
            </div>
            <button class="ml-auto flex items-center justify-center">
              <img src="assets/images/Arrow - Down 2.svg" alt="icon-arrow" class="w-5 h-5"/>
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
          <img src="${arrowSrc}" alt="icon-arrow" class="w-5 h-5"/>
          Terselesaikan (${count} tugas)
        </span>
      `);
    }
    renderTaskComplate();
  }

  return {
    initTaskComplate,
  };
});
