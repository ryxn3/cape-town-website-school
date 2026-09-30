// fun facts about cape town
let facts = [
    "Table Mountain is about 1085 metres high.",
    "The cable car on Table Mountain opened in 1929.",
    "Cape Town is called the Mother City.",
    "Thousands of African penguins live at Boulders Beach.",
    "The strong south-east wind is called the Cape Doctor.",
    "Kirstenbosch garden was started in 1913.",
    "Table Mountain is one of the New 7 Wonders of Nature."
];

let factText = document.getElementById("fact");
let factBtn = document.getElementById("fact-btn");

factBtn.addEventListener("click", function () {
    // pick a random one
    let i = Math.floor(Math.random() * facts.length);
    factText.textContent = facts[i];
});

// show the back to top button after scrolling down a bit
let topBtn = document.getElementById("top-btn");

window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});
