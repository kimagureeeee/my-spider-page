const slots = document.querySelectorAll(".slot");

// --------------------
// カード準備（52枚ランダム）
// --------------------
const suits = ["♡", "♧", "♤", "♢"];
const numbers = Array.from({ length: 13 }, (_, i) => i + 1);

let cards = [];
for (const suit of suits) {
    for (const number of numbers) {
        cards.push({ number, suit });
    }
}

// シャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(cards);

// 各列の枚数（52枚を10列に分配）
const counts = [6,6,6,6,6,6,6,6,5,5];
let index = 0;
let selectedCard = null;

// --------------------
// 初期配置（ずらして積む）
// --------------------
for (let i = 0; i < slots.length; i++) {
    for (let j = 0; j < counts[i]; j++) {
        const cardData = cards[index];
        const card = createCard(cardData.number, cardData.suit, j === counts[i] - 1);
        // カードをずらす
        card.style.top = `${j * 20}px`;
        card.style.left = `${5 + j * 2}px`;
        slots[i].appendChild(card);
        index++;
    }
}

// --------------------
// カード生成
// --------------------
function createCard(number, suit, isFront) {
    const card = document.createElement("div");
    card.classList.add("card");

    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = `${number}${suit}`;
    card.appendChild(label);

    if (isFront) {
        card.classList.add("front");
        card.addEventListener("click", () => onCardClick(card));
    } else {
        card.classList.add("back");
    }

    card.dataset.number = number;
    card.dataset.suit = suit;

    return card;
}

// --------------------
// クリック処理
// --------------------
function onCardClick(card) {
    if (!selectedCard) {
        selectedCard = card;
        card.classList.add("selected");
        return;
    }

    if (selectedCard === card) {
        selectedCard.classList.remove("selected");
        selectedCard = null;
        return;
    }

    const fromNumber = Number(selectedCard.dataset.number);
    const toNumber = Number(card.dataset.number);

    if (fromNumber + 1 === toNumber) {
        moveCardsStack(selectedCard, card.parentElement);
    }

    selectedCard.classList.remove("selected");
    selectedCard = null;
}

// --------------------
// カードの塊移動（ずらしを維持）
// --------------------
function moveCardsStack(card, targetSlot) {
    const fromSlot = card.parentElement;
    const cardsInFromSlot = Array.from(fromSlot.querySelectorAll(".card"));

    // クリックしたカード以降を移動
    const movingCards = cardsInFromSlot.slice(cardsInFromSlot.indexOf(card));

    movingCards.forEach((c, i) => {
        c.remove();
        c.style.top = `${(targetSlot.children.length + i) * 20}px`;
        c.style.left = `${5 + (targetSlot.children.length + i) * 2}px`; // ずらしを維持
        targetSlot.appendChild(c);
    });

    // 元の列の新しい一番上のカードを表に
    const remainingCards = fromSlot.querySelectorAll(".card");
    if (remainingCards.length > 0) {
        const topCard = remainingCards[remainingCards.length - 1];
        topCard.classList.remove("back");
        topCard.classList.add("front");
        topCard.querySelector(".label").textContent = `${topCard.dataset.number}${topCard.dataset.suit}`;
        topCard.addEventListener("click", () => onCardClick(topCard));
    }
}
