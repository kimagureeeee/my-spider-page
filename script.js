const slots = document.querySelectorAll(".slot");

// --------------------
// カード準備（52枚ランダム）
// --------------------
const suits = ["♤", "♢"];
const numbers = Array.from({ length: 13 }, (_, i) => i + 1);

let cards = [];
for (let d = 0; d < 2; d++) {   // デッキ2個
    for (const suit of suits) {
        for (const number of numbers) {
            cards.push({ number, suit });
        }
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
const counts = [6,6,6,6,6,6,6,6,5,5]; // 合計52枚
let index = 0;
let selectedCard = null;

// --------------------
// 初期配置（ずらして積む）
// --------------------
for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    for (let j = 0; j < counts[i]; j++) {
        const cardData = cards[index];
        // 一番手前のカードは表、それ以外は裏
        const isFront = (j === counts[i] - 1);
        const card = createCard(cardData.number, cardData.suit, isFront);
        card.style.top = `${j * 20}px`;
        card.style.left = `5px`;
        slot.appendChild(card);
        index++;
    }
}

// --------------------
// カード生成
// --------------------
function createCard(number, suit, isFront) {
    const card = document.createElement("div");
    card.classList.add("card");

    if (isFront) {
        card.classList.add("front");
        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = `${number}${suit}`;
        card.appendChild(label);
        card.addEventListener("click", () => onCardClick(card));
    } else {
        card.classList.add("back");
        // 裏カードは数字なし
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
        card.classList.remove("selected");
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
// カードの塊移動
// --------------------
function moveCardsStack(card, targetSlot) {
    const fromSlot = card.parentElement;
    const cardsInFromSlot = Array.from(fromSlot.querySelectorAll(".card"));

    const movingCards = cardsInFromSlot.slice(cardsInFromSlot.indexOf(card));

    movingCards.forEach((c, i) => {
        c.remove();
        c.style.top = `${(targetSlot.children.length + i) * 20}px`;
        c.style.left = `5px`;
        targetSlot.appendChild(c);
    });

    // 元の列の新しい一番上のカードを表に
    const remainingCards = fromSlot.querySelectorAll(".card");
    if (remainingCards.length > 0) {
        const topCard = remainingCards[remainingCards.length - 1];
        topCard.classList.remove("back");
        topCard.classList.add("front");

        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = `${topCard.dataset.number}${topCard.dataset.suit}`;
        topCard.appendChild(label);

        topCard.addEventListener("click", () => onCardClick(topCard));
    }
}
