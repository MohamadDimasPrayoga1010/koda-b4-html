export function initCustomCheckbox() {
  $(document).on(
    "change",
    ".custom-checkbox input[type='checkbox']",
    function () {
      const $checkbox = $(this);
      const $box = $checkbox.closest(".custom-checkbox");

      if ($checkbox.is(":checked")) {
        $box.css({
          backgroundImage: "url('assets/images/check-white.svg')",
          backgroundSize: "80%",
          backgroundRepeat: "no-repeat ",
          backgroundPosition: "center",
          backgroundColor: "#ff5f26",
          borderColor: "#ff5f26",
        });
      } else {
        $box.css({
          backgroundImage: "none",
          backgroundColor: "transparent",
          borderColor: "gray",
        });
      }
    }
  );
}

