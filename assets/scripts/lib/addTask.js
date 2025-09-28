define(["jquery", "moment"], function ($, moment) {
  const STORAGE_KEY = "tasks";

  function initToggleForm() {
    const $form = $("#taskForm");
    $form.hide();

    $("#addTask").on("click", () => $form.toggle());

    $(document).on("click", "#new-task", function () {
      const $this = $(this);
      if (!$this.is(":checked")) return;

      const title = $("#taskTitle").val().trim();
      if (!title) {
        alert("Masukkan nama tugas dulu cuy");
        $this.prop("checked", false);
        return;
      }

      const tasks = loadTasks();
      const newTask = {
        id: Date.now(),
        title,
        desc: $("#taskDesc").val().trim(),
        date: $("#taskDate").val().trim(),
        completed: false,
        createdAt: moment().format(),
        subtask: [],
      };

      tasks.push(newTask);
      saveTasks(tasks);

  
      $("#taskTitle, #taskDesc, #taskDate").val("");
      $this.prop("checked", false);
      $form.hide();
      renderTasks();
    });
  }

  function formatDate(dateString) {
    if (!dateString) return "Hari ini";

    const taskDate = moment(dateString, ["DD/MM/YYYY", "DD-MM-YYYY"], true);
    if (!taskDate.isValid()) return "Tanggal tidak valid";

    return taskDate.isSame(moment(), "day")
      ? "Hari ini"
      : taskDate.format("DD MMMM YYYY");
  }

  function renderSubtasks(task) {
    return (task.subtask || [])
      .map(
        (sub) => `
      <article class="flex justify-between items-center subtask-item" data-subtask-id="${
        sub.id
      }" data-task-id="${task.id}">
  <div class="flex items-center gap-3 my-3">
    <!-- Custom Checkbox -->
    <label class="relative cursor-pointer">
      <input type="checkbox" class="sr-only peer subtask-checkbox" data-subtask-id="${
        sub.id
      }" ${sub.completed ? "checked" : ""}/>
      <div class="custom-checkbox w-7 h-7 rounded-full border border-gray-400 peer-checked:bg-[#FF5F26] flex items-center justify-center">
        <svg class="w-4 h-4 text-white peer-checked:block hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </label>
    <p class="text-base font-normal ${
      sub.completed ? "line-through text-gray-500" : ""
    }">${sub.title}</p>
  </div>
  <button class="delete-subtask-btn text-red-500 hover:text-red-700" data-subtask-id="${
    sub.id
  }" data-task-id="${task.id}" title="Hapus subtask">
    <img src="/assets/images/Vector.png" alt=""/>
  </button>
</article>
`
      )
      .join("");
  }

  function renderTasks() {
    const tasks = loadTasks();
    const $taskList = $("#taskList");
    $taskList.empty();

    tasks.forEach((task) => {
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
          <button class="btnEdit" data-task-id="${task.id}">
            <img src="/assets/images/more-vertical.png" alt="icon-more" class="iconMore"/>
          </button>
          <div class="editTask absolute top-[35px] right-[-90px] w-[120px] h-[73px] p-2 bg-white border border-[#CCCED2] rounded-lg z-50 md:w-[189px] md:h-[108px] md:p-6 md:right-[-160px]" data-task-id="${
            task.id
          }" style="display: none;">
            <div class="flex gap-2 mb-3">
              <button class="flex items-center gap-3 text-xs md:text-base md:font-normal rename-task" data-task-id="${
                task.id
              }">
                <img src="/assets/images/Edit.png" alt="icon-edit" class="w-5 h-5 md:w-6 md:h-6"/>Rename task
              </button>
            </div>
            <div>
              <button class="flex items-center gap-3 text-xs md:text-base md:font-normal delete-task" data-task-id="${
                task.id
              }">
                <img src="/assets/images/Delete.png" alt="icon-delete" class="w-5 h-5 md:w-6 md:h-6"/>Delete task
              </button>
            </div>
          </div>
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
      </section>`;
      $taskList.append(taskHtml);
    });
  }

  function loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  }

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
