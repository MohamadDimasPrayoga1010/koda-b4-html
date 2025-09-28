define(["jquery", "addTask"], function ($, addTask) {
  
  function initToggleEdit() {
    $(document).on("click", ".btnEdit", function (e) {
      e.stopPropagation();

      const $btnEdit = $(this);
      const $taskItem = $btnEdit.closest(".task-item");
      const $editTask = $taskItem.find(".editTask");
      const $iconMore = $btnEdit.find("img");

      $editTask.toggle();

      if ($editTask.is(":visible")) {
        $iconMore.attr("src", "/assets/images/more-vertical-color.png");
      } else {
        $iconMore.attr("src", "/assets/images/more-vertical.png");
      }

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

  function initRenameTask() {
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

      function saveRename() {
        const newTitle = $input.val().trim();
        if (!newTitle) {
          alert("Nama task tidak boleh kosong");
          $input.focus();
          return;
        }

        const tasks = addTask.loadTasks();
        const task = tasks.find((t) => t.id == taskId);
        if (task) {
          task.title = newTitle;
          addTask.saveTasks(tasks);
          addTask.renderTasks(); 
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

  function initDeleteTask() {
    $(document).on("click", ".delete-task", function (e) {
      e.stopPropagation();

      const taskId = $(this).data("task-id");
      let tasks = addTask.loadTasks();
      tasks = tasks.filter((t) => t.id != taskId);
      addTask.saveTasks(tasks);

      addTask.renderTasks();
    });
  }

  return {
    initToggleEdit,
    initRenameTask,
    initDeleteTask,
  };
});
