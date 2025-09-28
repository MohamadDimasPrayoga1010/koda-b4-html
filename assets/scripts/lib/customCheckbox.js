define(["jquery"], function ($) {
  function initCustomCheckbox() {
    $(document).on("change", ".custom-checkbox", function () {
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
    });
  }

  return {
    initCustomCheckbox: initCustomCheckbox,
  };
});
