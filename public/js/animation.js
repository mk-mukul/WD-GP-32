
// Metis animation
const text = document.getElementById("title-metis")
const splitText = text.textContent.split("");

let animation = () => {
    text.textContent = "";
    for (let i = 0; i < splitText.length; i++) {
        text.innerHTML += "<span>" + splitText[i] + "</span>"
    }

    let char = 0;

    let timer = setInterval(() => {
        const span = text.querySelectorAll('span')[char];
        span.classList.add('animation');
        char++;
        if (char === splitText.length) {
            complete();
            return;
        }
    }, 50);

    function complete() {
        clearInterval(timer);
        timer = null;
    }
}
if (document.getElementById("main-container") === null) {
    document.querySelector("nav").setAttribute("class", "fixed-top nav");
    animation();
}

// Card and heading animation using gsap
var rule = CSSRulePlugin.getRule(".gsap-headings::after");
var tl = gsap.timeline({ default: { duration: 1 } });
tl.from(".gsap-up", { y: -20, stagger: 0.2, opacity: 0 })
    .to(rule, { duration: 1.5, cssRule: { scaleY: 0 } }, "-=2");

document.querySelectorAll(".animation-reverse").forEach(element => element.addEventListener("click", () => {
    tl.reversed() ? tl.play() : tl.reverse();
}));

document.querySelectorAll(".hide-scrollbar")[0].addEventListener("click", () => {
    document.getElementById("check").checked = false;
});

document.getElementById("hide-navlinks").addEventListener("click", () => {
    document.getElementById("check").checked = false;
});