define(["jquery", "moment"], function ($, moment) {
  const STORAGE_KEY = "tasks"; // key untuk localStorage

  // === Fungsi inisialisasi toggle form tambah task ===
  function initToggleForm() {
    const $form = $("#taskForm");
    $form.hide(); // hide form awal

    // toggle form saat tombol "Add Task" diklik
    $("#addTask").on("click", () => $form.toggle());

    // Event: checkbox task utama
    $(document).on("change", ".task-checkbox", function () {
      const $checkbox = $(this);
      const taskId = $checkbox.data("task-id");
      const $checkmark = $checkbox
        .siblings(".custom-checkbox")
        .find(".checkmark-icon");

      // tampilkan/hide checkmark sesuai status checkbox
      $checkbox.is(":checked") ? $checkmark.show() : $checkmark.hide();

      const tasks = loadTasks();

      // find task dan update completed
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = $checkbox.is(":checked");

        // pakai spread operator saat menyimpan array baru
        saveTasks([...tasks]);

        renderTasks();
        $(document).trigger("taskCompletionChanged");
      }
    });

    // Event: checkbox subtask
    $(document).on("change", ".subtask-checkbox", function () {
      const $checkbox = $(this);
      const $subtaskItem = $checkbox.closest(".subtask-item");

      // Destructuring data-task-id
      const { taskId } = $subtaskItem.data();
      const subtaskId = $checkbox.data("subtask-id");
      const $checkmark = $checkbox.siblings(".custom-checkbox").find("svg");

      $checkbox.is(":checked") ? $checkmark.show() : $checkmark.hide();

      const tasks = loadTasks();
      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        // Destructuring subtask
        const subtask = task.subtask.find((s) => s.id === subtaskId);
        if (subtask) {
          subtask.completed = $checkbox.is(":checked");

          // jika semua subtask selesai, tandai task utama selesai
          if (task.subtask.length > 0) {
            task.completed = task.subtask.every((s) => s.completed);
          }

          // Simpan array baru pakai spread operator
          saveTasks([...tasks]);
          renderTasks();

          $(document).trigger("taskCompletionChanged");
        }
      }
    });

    // Event: tambah task baru
    $(document).on("click", "#new-task", function () {
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
            "Format tanggal salah cuyy Gunakan format DD/MM/YYYY atau DD-MM-YYYY"
          );
          $this.prop("checked", false);
          return;
        }
      }

      const tasks = loadTasks();

      // Buat task baru
      const newTask = {
        id: Date.now(),
        title,
        desc,
        date: dateInput,
        completed: false,
        createdAt: moment().format(),
        subtask: [],
      };

      // Simpan array baru pakai spread operator
      saveTasks([...tasks, newTask]);

      // Reset form
      $("#taskTitle, #taskDesc, #taskDate").val("");
      $this.prop("checked", false);
      $form.hide();
      renderTasks();
    });
  }

  // === Fungsi format tanggal ===
  function formatDate(dateString) {
    if (!dateString) return "Hari ini";

    const taskDate = moment(dateString, ["DD/MM/YYYY", "DD-MM-YYYY"], true);
    if (!taskDate.isValid()) return "Tanggal tidak valid";

    return taskDate.isSame(moment(), "day")
      ? "Hari ini"
      : taskDate.format("DD MMMM YYYY");
  }

  // === Fungsi render subtasks ===
  function renderSubtasks(task) {
    const { subtask = [], id: taskId } = task; // destructuring default
    return subtask
      .map((sub) => {
        const { id: subtaskId, completed, title } = sub; // destructuring
        return `
          <article class="flex justify-between items-center subtask-item" data-subtask-id="${subtaskId}" data-task-id="${taskId}">
            <div class="flex items-center gap-3 my-3">
              <label class="relative cursor-pointer">
                <input type="checkbox" class="sr-only peer subtask-checkbox" data-subtask-id="${subtaskId}" ${
          completed ? "checked" : ""
        }/>
                <div class="custom-checkbox w-7 h-7 rounded-full border border-gray-400 peer-checked:bg-[#FF5F26] flex items-center justify-center">
                  <svg class="checkmark-icon w-4 h-4 text-white" style="display: ${
                    completed ? "block" : "none"
                  };" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
              <p class="text-base font-normal ${
                completed ? "line-through text-gray-500" : ""
              }">${title}</p>
            </div>
            <button class="delete-subtask-btn text-red-500 hover:text-red-700" data-subtask-id="${subtaskId}" data-task-id="${taskId}" title="Hapus subtask">
              <img src="/assets/images/Vector.png" alt=""/>
            </button>
          </article>
          `;
      })
      .join("");
  }

  // === Fungsi render task ===
  function renderTasks() {
    const tasks = loadTasks();
    const $taskList = $("#taskList");
    $taskList.empty();

    const activeTasks = tasks.filter((task) => !task.completed);

    activeTasks.forEach((task) => {
      const { id: taskId, title, desc, completed, date } = task; // destructuring
      const taskHtml = `
        <article class="flex justify-between items-center md:gap-3 task-item" data-task-id="${taskId}">
          <div class="flex gap-1 items-center my-3 md:gap-3 relative">
            <label class="relative cursor-pointer">
              <input type="checkbox" class="sr-only peer task-checkbox" data-task-id="${taskId}" ${
        completed ? "checked" : ""
      }/>
              <div class="custom-checkbox w-8 h-8 rounded-full border border-gray-400 peer-checked:bg-[#FF5F26] flex items-center justify-center">
                <svg class="checkmark-icon w-5 h-5 text-white" style="display: ${
                  completed ? "block" : "none"
                };" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </label>
            <label class="flex flex-col ml-2">
              <span class="taskTitle font-medium text-[#293038] text-base md:text-lg">${title}</span>
              <span class="taskDesc text-[#7a7f83] text-sm md:m-0">${
                desc || ""
              }</span>
            </label>
            <button class="taskDate bg-[#FFEBD3] text-[#FF5F26] px-[10px] py-[6px] text-xs rounded-full md:px-[12px] md:py-[8px]">${formatDate(
              date
            )}</button>
            <button class="btnEdit" data-task-id="${taskId}">
              <img src="/assets/images/more-vertical.png" alt="icon-more" class="iconMore"/>
            </button>
            <div class="editTask absolute top-[35px] right-[-90px] w-[120px] h-[73px] p-2 bg-white border border-[#CCCED2] rounded-lg z-50 md:w-[189px] md:h-[108px] md:p-6 md:right-[-160px]" data-task-id="${taskId}" style="display: none;">
              <div class="flex gap-2 mb-3">
                <button class="flex items-center gap-3 text-xs md:text-base md:font-normal rename-task" data-task-id="${taskId}">
                  <img src="/assets/images/Edit.png" alt="icon-edit" class="w-5 h-5 md:w-6 md:h-6"/>Rename task
                </button>
              </div>
              <div>
                <button class="flex items-center gap-3 text-xs md:text-base md:font-normal delete-task" data-task-id="${taskId}">
                  <img src="/assets/images/Delete.png" alt="icon-delete" class="w-5 h-5 md:w-6 md:h-6"/>Delete task
                </button>
              </div>
            </div>
          </div>
          <button class="btn-toggle-subtask" data-task-id="${taskId}">
            <img src="/assets/images/Arrow - Down 2.svg" alt="icon-arrow" class="iconSubtask"/>
          </button>
        </article>
        <section class="subtask w-full bg-[#f5f5f5] py-6 px-4 rounded-lg my-3" data-task-id="${taskId}" style="display: none;">
          <div class="flex justify-between items-center">
            <p class="text-base font-medium text-[#293038]">Subtask</p>
            <button class="flex items-center text-xs font-semibold text-[#FF5F26] border border-[#CCCED2] px-2.5 py-1.5 rounded-full gap-1 add-subtask-btn" data-task-id="${taskId}">
              <img src="/assets/images/Plus-orange.svg" alt="" />Tambah
            </button>
          </div>
          ${renderSubtasks(task)}
        </section>
      `;
      $taskList.append(taskHtml);
    });
  }

  // === Load tasks dari localStorage ===
  function loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  }

  // === Save tasks ke localStorage ===
  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
      alert("Gagal menyimpan tugas. Storage penuh atau error.");
    }
  }

  return {
    initToggleForm,
    renderTasks,
    loadTasks,
    saveTasks,
  };
});
