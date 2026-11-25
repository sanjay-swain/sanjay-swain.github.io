// Theme toggle. The initial theme is set by the inline script in base.html;
// this file only handles the button and remembers the choice.
(function () {
    "use strict";

    var root = document.documentElement;
    var button = document.querySelector(".theme-toggle");
    if (!button) return;

    var media = window.matchMedia("(prefers-color-scheme: light)");

    function storedChoice() {
        try {
            var value = localStorage.getItem("theme");
            return value === "light" || value === "dark" ? value : null;
        } catch (e) {
            return null;
        }
    }

    function current() {
        var attr = root.getAttribute("data-theme");
        if (attr === "light" || attr === "dark") return attr;
        return media.matches ? "light" : "dark";
    }

    function apply(theme) {
        root.setAttribute("data-theme", theme);
        button.setAttribute("aria-pressed", String(theme === "dark"));
    }

    button.addEventListener("click", function () {
        var next = current() === "dark" ? "light" : "dark";
        apply(next);
        try {
            localStorage.setItem("theme", next);
        } catch (e) {}
    });

    // Keep following the system while no explicit choice is stored.
    media.addEventListener("change", function (event) {
        if (!storedChoice()) apply(event.matches ? "light" : "dark");
    });

    apply(current());
})();
