var onScreen = "no";
const counters = document.querySelectorAll('.counter');
var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting === true) {
        onScreen = "yes";
        // console.log(onScreen);
        if (onScreen === "yes") {
            // counters.forEach(counter => {
            const updateCount = () => {
                const counter = counters[0]
                const target = Number(counter.getAttribute('data-bs-target'));
                var count = +counter.innerText;
                const inc = 1;

                if (count < target) {
                    counter.innerText = count + inc;
                    setTimeout(updateCount, 50);
                } else {
                    count.innerText = target;
                }
            }
            updateCount();
            // });
            const updateCount2 = () => {
                const counter = counters[1]
                const target = Number(counter.getAttribute('data-bs-target'));
                var count = +counter.innerText;
                const inc = 1;

                if (count < target) {
                    counter.innerText = count + inc;
                    setTimeout(updateCount2, 100);
                } else {
                    count.innerText = target;
                }
            }
            updateCount2();
        }
    }
}, { threshold: [1] });
observer.observe(document.querySelector("#main-container"));

// header colour change on scroll
window.addEventListener("scroll", () => {
    let windowPosition = window.scrollY > 110;
    if (windowPosition) {
        document.querySelector("nav").setAttribute("class", "fixed-top nav");
    }
    else if (!windowPosition) {
        document.querySelector("nav").setAttribute("class", "fixed-top nav-0");
    }
})