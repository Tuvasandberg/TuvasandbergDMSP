// Interaktioner för ljusboxen i projektkarusellen.
// Hindra webbläsaren från att återställa föregående scrollposition vid sidladdning.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
function borjaHogstUpp() {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previousBehavior;
    });
}
window.addEventListener("pageshow", borjaHogstUpp);
window.addEventListener("load", borjaHogstUpp);
document.addEventListener("DOMContentLoaded", () => {
    const ljusbox = document.getElementById("ljusbox");
    const ljusboxBild = document.getElementById("ljusbox-bild");
    const ljusboxText = document.getElementById("ljusbox-text");
    const stangKnapp = document.getElementById("ljusbox-stang");
    const foregaendeKnapp = document.getElementById("ljusbox-foregaende");
    const nastaKnapp = document.getElementById("ljusbox-nasta");
    const kort = [...document.querySelectorAll(".projekt-kort")];
    let aktivtIndex = 0;

    // Använd första karusellgruppen som källa så att den sömlösa kopian inte
    // ger dubbla bilder när man bläddrar i ljusboxen.
    const unikaBilder = [...document.querySelectorAll(".karusell-grupp:not([aria-hidden='true']) .projekt-kort")]
        .map((projekt) => ({
            src: projekt.getAttribute("data-bild") || projekt.querySelector("img")?.getAttribute("src"),
            alt: projekt.querySelector("img")?.alt || "Förstorad projektbild",
            rubrik: projekt.getAttribute("data-rubrik") || projekt.querySelector("h3")?.textContent || "",
            beskrivning: projekt.getAttribute("data-beskrivning") || projekt.querySelector("p")?.textContent || ""
        }))
        .filter((bild) => bild.src);

    function visaBild(index) {
        if (!unikabildFinns()) return;
        aktivtIndex = (index + unikaBilder.length) % unikaBilder.length;
        const bild = unikaBilder[aktivtIndex];
        ljusboxBild.src = bild.src;
        ljusboxBild.alt = bild.alt;

        const text = bild.beskrivning ? `<span>${bild.beskrivning}</span>` : "";
        ljusboxText.innerHTML = text;
        ljusboxText.style.display = text ? "block" : "none";
    }

    function unikabildFinns() {
        return Boolean(ljusbox && ljusboxBild && ljusboxText && unikaBilder.length);
    }

    function oppnaLjusbox(projekt) {
        if (!unikabildFinns()) return;
        const src = projekt.getAttribute("data-bild") || projekt.querySelector("img")?.getAttribute("src");
        const index = unikaBilder.findIndex((bild) => bild.src === src);
        visaBild(index >= 0 ? index : 0);
        ljusbox.classList.add("aktiv");
        ljusbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("ljusbox-oppen");
        stangKnapp?.focus();
    }

    function stangLjusbox() {
        if (!ljusbox) return;
        ljusbox.classList.remove("aktiv");
        ljusbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("ljusbox-oppen");
        if (ljusboxBild) {
            ljusboxBild.src = "";
            ljusboxBild.alt = "";
        }
    }

    kort.forEach((projekt) => {
        projekt.addEventListener("click", () => oppnaLjusbox(projekt));
    });

    stangKnapp?.addEventListener("click", stangLjusbox);
    foregaendeKnapp?.addEventListener("click", () => visaBild(aktivtIndex - 1));
    nastaKnapp?.addEventListener("click", () => visaBild(aktivtIndex + 1));

    ljusbox?.addEventListener("click", (event) => {
        if (event.target === ljusbox) stangLjusbox();
    });

    document.addEventListener("keydown", (event) => {
        if (!ljusbox?.classList.contains("aktiv")) return;
        if (event.key === "Escape") stangLjusbox();
        if (event.key === "ArrowLeft") visaBild(aktivtIndex - 1);
        if (event.key === "ArrowRight") visaBild(aktivtIndex + 1);
    });
});
