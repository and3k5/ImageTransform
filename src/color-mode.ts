export const matchDark = window.matchMedia("(prefers-color-scheme: dark)");

export function setDarkModeOnDocument(newValue: boolean) {
    if (newValue) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-bs-theme");
    }
}
