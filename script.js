const dealBtn = document.getElementById("deal");
const field = document.getElementById("field");

// カードのデータ（今回は数字だけ）
const cards = [1, 2, 3, 4, 5];

dealBtn.addEventListener("click", function () {
    field.innerHTML = ""; // 前のカードを消す

    for (let i = 0; i < cards.length; i++) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.textContent = cards[i];

        field.appendChild(cardDiv);
    }
});
