const slots = document.querySelectorAll(".slot");

// ♤1〜13を2枚ずつ（26枚）
let cards = [];
for (let num = 1; num <= 13; num++) {
    cards.push("♤" + num);
    cards.push("♤" + num);
}

// 各列に配る枚数
const counts = [3, 3, 3, 3, 3, 3, 2, 2, 2, 2];

// 枠にカードを配置（表向き）
let index = 0;

for (let i = 0; i < slots.length; i++) {
    for (let j = 0; j < counts[i]; j++) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.textContent = cards[index];
        slots[i].appendChild(cardDiv);
        index++;
    }
}
