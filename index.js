
const searchBtn = document.querySelector('#search');
const showBtn = document.querySelector('#show');
const queryInput = document.querySelector('#query');
const results = document.querySelector('#results-container');

showBtn.addEventListener('click', () => {
    fetch(`http://localhost:8021/jobs`)
        .then((res) => res.json())
        .then((data) => {
            results.style.display = 'flex';
            for (let item of data) {
                createJob(item);
            }
        })
});

const createJob = (job) => {
    const content = `
        <h1>${job.title}</h1>
        <hr>
        <h2>${job.company}</h2>
        <p><em>${job.place}</em></p>
        <div class="links">
            <div><a href="${job.jobLink}">Job Link</a></div>
            <div><a href="${job.applyLink}">Apply here</a></div>
        </div>
    `;
    const box = document.createElement('div');
    box.innerHTML = content;
    box.classList.add('job-box');
    results.appendChild(box);
}

// Button Effects
function createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

const buttons = document.getElementsByTagName("button");
for (const button of buttons) {
    button.addEventListener("click", createRipple);
}