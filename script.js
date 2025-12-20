const dealBtn = document.getElementById("deal");
const field = document.getElementById("field");

const cards = [1, 2, 3, 4, 5,6];

dealBtn.addEventListener("click", function () {
    field.innerHTML = "";

    for (let i = 0; i < cards.length; i++) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.textContent = cards[i];
        field.appendChild(cardDiv);
    }
});
