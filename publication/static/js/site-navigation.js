(function () {
  var toggle = document.querySelector("header button[aria-controls]");
  var menu = document.getElementById("site-navigation-menu");
  if (!toggle || !menu) return;
  var content = menu.nextElementSibling;
  var menuIcon = toggle.innerHTML;
  var closeIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = open ? closeIcon : menuIcon;
    menu.hidden = !open;
    if (content) content.hidden = open;
    if (open) window.scrollTo(0, 0);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
})();
