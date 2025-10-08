const STORAGE_KEY = "tasks";

export function initToggleForm() {
  const $form = $("#taskForm");
  $form.hide();

  $("#addTask").on("click", () => $form.toggle());

  $(document).on("change", ".task-checkbox", function () {
    try {
      const $checkbox = $(this);
      const taskId = $checkbox.data("task-id");
      const $checkmark = $checkbox
        .siblings(".custom-checkbox")
        .find(".checkmark-icon");

      $checkbox.is(":checked") ? $checkmark.show() : $checkmark.hide();

      const tasks = loadTasks();
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = $checkbox.is(":checked");
        saveTasks(tasks);
        renderTasks();
        $(document).trigger("taskCompletionChanged");
      }
    } catch (err) {
      console.error("Error toggling task checkbox:", err);
    }
  });

  $(document).on("change", ".subtask-checkbox", function () {
    try {
      const $checkbox = $(this);
      const $subtaskItem = $checkbox.closest(".subtask-item");
      const { taskId } = $subtaskItem.data();
      const subtaskId = $checkbox.data("subtask-id");
      const $checkmark = $checkbox.siblings(".custom-checkbox").find("svg");

      $checkbox.is(":checked") ? $checkmark.show() : $checkmark.hide();

      const tasks = loadTasks();
      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        const subtask = task.subtask.find((s) => s.id === subtaskId);
        if (subtask) {
          subtask.completed = $checkbox.is(":checked");
          if (task.subtask.length > 0) {
            task.completed = task.subtask.every((s) => s.completed);
          }
          saveTasks(tasks);
          renderTasks();
          $(document).trigger("taskCompletionChanged");
        }
      }
    } catch (err) {
      console.error("Error toggling subtask checkbox:", err);
    }
  });

  $(document).on("click", "#new-task", function () {
    try {
      const $this = $(this);
      if (!$this.is(":checked")) return;

      const title = $("#taskTitle").val().trim();
      const desc = $("#taskDesc").val().trim();
      const dateInput = $("#taskDate").val().trim();

      if (!title) {
        alert("Masukkan nama tugas dulu cuy");
        $this.prop("checked", false);
        return;
      }

      if (dateInput) {
        const taskDate = moment(dateInput, ["DD/MM/YYYY", "DD-MM-YYYY"], true);
        if (!taskDate.isValid()) {
          alert(
            "Format tanggal salah cuyy. Gunakan format DD/MM/YYYY atau DD-MM-YYYY"
          );
          $this.prop("checked", false);
          return;
        }
      }

      const tasks = loadTasks();

      const newTask = {
        id: Date.now(),
        title,
        desc,
        date: dateInput,
        completed: false,
        createdAt: moment().format(),
        subtask: [],
      };

      saveTasks([...tasks, newTask]);

      $("#taskTitle, #taskDesc, #taskDate").val("");
      $this.prop("checked", false);
      $form.hide();
      renderTasks();
    } catch (err) {
      console.error("Error adding new task:", err);
    }
  });
}

export function formatDate(dateString) {
  try {
    if (!dateString) return "Hari ini";
    const taskDate = moment(dateString, ["DD/MM/YYYY", "DD-MM-YYYY"], true);
    if (!taskDate.isValid()) return "Tanggal tidak valid";
    return taskDate.isSame(moment(), "day")
      ? "Hari ini"
      : taskDate.format("DD MMMM YYYY");
  } catch (err) {
    console.error("Error formatting date:", err);
    return dateString;
  }
}

export function renderSubtasks(task) {
  const { subtask = [], id: taskId } = task;
  try {
    return subtask
      .map(
        (sub) => `
        <article class="flex justify-between items-center subtask-item" data-subtask-id="${
          sub.id
        }" data-task-id="${taskId}">
          <div class="flex items-center gap-3 my-3">
            <label class="relative cursor-pointer">
              <input type="checkbox" class="sr-only peer subtask-checkbox" data-subtask-id="${
                sub.id
              }" ${sub.completed ? "checked" : ""}/>
              <div class="custom-checkbox w-7 h-7 rounded-full border border-gray-400 peer-checked:bg-[#FF5F26] flex items-center justify-center">
                <svg class="checkmark-icon w-4 h-4 text-white" style="display: ${
                  sub.completed ? "block" : "none"
                };" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </label>
            <p class="text-base font-normal ${
              sub.completed ? "line-through text-gray-500" : ""
            }">${sub.title}</p>
          </div>
          <button class="delete-subtask-btn text-red-500 hover:text-red-700" data-subtask-id="${
            sub.id
          }" data-task-id="${taskId}" title="Hapus subtask">
            <img src="/assets/images/Vector.png" alt=""/>
          </button>
        </article>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error rendering subtasks:", err);
    return "";
  }
}

export function renderTasks() {
  const tasks = loadTasks();
  const $taskList = $("#taskList");
  $taskList.empty();

  tasks
    .filter((t) => !t.completed)
    .forEach((task) => {
      const taskHtml = `
      <article class="flex justify-between items-center md:gap-3 task-item" data-task-id="${
        task.id
      }">
        <div class="flex gap-1 items-center my-3 md:gap-3 relative">
          <label class="relative cursor-pointer">
            <input type="checkbox" class="sr-only peer task-checkbox" data-task-id="${
              task.id
            }" ${task.completed ? "checked" : ""}/>
            <div class="custom-checkbox w-8 h-8 rounded-full border border-gray-400 peer-checked:bg-[#FF5F26] flex items-center justify-center">
              <svg class="checkmark-icon w-5 h-5 text-white" style="display: ${
                task.completed ? "block" : "none"
              };" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </label>
          <label class="flex flex-col ml-2">
            <span class="taskTitle font-medium text-[#293038] text-base md:text-lg">${
              task.title
            }</span>
            <span class="taskDesc text-[#7a7f83] text-sm md:m-0">${
              task.desc || ""
            }</span>
          </label>
          <button class="taskDate bg-[#FFEBD3] text-[#FF5F26] px-[10px] py-[6px] text-xs rounded-full md:px-[12px] md:py-[8px]">${formatDate(
            task.date
          )}</button>
        </div>
        <button class="btn-toggle-subtask" data-task-id="${task.id}">
          <img src="/assets/images/Arrow - Down 2.svg" alt="icon-arrow" class="iconSubtask"/>
        </button>
      </article>
      <section class="subtask w-full bg-[#f5f5f5] py-6 px-4 rounded-lg my-3" data-task-id="${
        task.id
      }" style="display: none;">
        <div class="flex justify-between items-center">
          <p class="text-base font-medium text-[#293038]">Subtask</p>
          <button class="flex items-center text-xs font-semibold text-[#FF5F26] border border-[#CCCED2] px-2.5 py-1.5 rounded-full gap-1 add-subtask-btn" data-task-id="${
            task.id
          }">
            <img src="/assets/images/Plus-orange.svg" alt="" />Tambah
          </button>
        </div>
        ${renderSubtasks(task)}
      </section>
    `;
      $taskList.append(taskHtml);
    });
}

export function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (err) {
    console.error("Error loading tasks:", err);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Error saving tasks:", err);
  }
}
