import * as addTask from "./addTask.js";
  export function initToggleByDate() {
    const $byDateContainer = $("#byDateTask");
    const $arrow = $("#arrowByDate");
    const $btn = $("#btnByDate");
    const $text = $btn.find("span");

    $byDateContainer.hide();

    $btn.on("click", function () {
      $byDateContainer.toggle();
      if ($byDateContainer.is(":visible")) {
        $arrow.attr("src", "/assets/images/Arrow - Up 2.png");
        $text.removeClass("text-[#ff5f26]").addClass("text-[#7A7F83]");
        $btn.removeClass("border-[#ff5f26]").addClass("border-[#7A7F83]");
      } else {
        $arrow.attr("src", "/assets/images/Arrow - Down 2.png");
        $text.removeClass("text-[#7A7F83]").addClass("text-[#ff5f26]");
        $btn.removeClass("border-[#7A7F83]").addClass("border-[#ff5f26]");
      }
    });

    const byDate = $("#byDate");
    const byTime = $("#byTime");
    const latest = $("#latest");

    $(document).on("change", "input[name='by-tanggal']", function () {
      let tasks = addTask.loadTasks() || [];
      if (!Array.isArray(tasks)) tasks = [];

      if (this === byDate[0]) {
        tasks.sort((a, b) => {
          const dateA = moment(
            a.date,
            [
              "DD/MM/YYYY HH:mm",
              "DD/MM/YYYY",
              "DD-MM-YYYY HH:mm",
              "DD-MM-YYYY",
            ],
            true
          );
          const dateB = moment(
            b.date,
            [
              "DD/MM/YYYY HH:mm",
              "DD/MM/YYYY",
              "DD-MM-YYYY HH:mm",
              "DD-MM-YYYY",
            ],
            true
          );

          if (dateA.isValid() && dateB.isValid()) return dateA - dateB;
          if (dateA.isValid()) return -1;
          if (dateB.isValid()) return 1;
          return 0;
        });
      }

      if (this === byTime[0]) {
        tasks.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
      }

      if (this === latest[0]) {
        tasks.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      }
      addTask.saveTasks(tasks);
      addTask.renderTasks();
    });
  }

 
  

