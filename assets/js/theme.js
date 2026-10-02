(function () {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    var LABELS = {
        dark: { aria: "Switch to light mode", title: "Switch to light mode" },
        light: { aria: "Switch to dark mode", title: "Switch to dark mode" },
    };

    function apply(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        var labels = LABELS[theme] || LABELS.dark;
        toggle.setAttribute("aria-label", labels.aria);
        toggle.setAttribute("title", labels.title);
    }

    function current() {
        return (
            document.documentElement.getAttribute("data-theme") || "dark"
        );
    }

    toggle.addEventListener("click", function () {
        var next = current() === "dark" ? "light" : "dark";
        try {
            localStorage.setItem("theme", next);
        } catch (e) {}
        apply(next);
    });
})();