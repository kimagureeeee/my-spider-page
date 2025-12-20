const slots = document.querySelectorAll(".slot");

// --------------------
// カード準備
// --------------------
let cards = [];
for (let num = 1; num <= 13; num++) {
    cards.push(num);
    cards.push(num);
}

// 各列の枚数
const counts = [3, 3, 3, 3, 3, 3, 2, 2, 2, 2];

let index = 0;

// 選択中カード
let selectedCard = null;

// --------------------
// 初期配置
// --------------------
for (let i = 0; i < slots.length; i++) {
    for (let j = 0; j < counts[i]; j++) {
        const card = createCard(cards[index], j === counts[i] - 1);
        card.style.top = `${j * 20}px`;
        slots[i].appendChild(card);
        index++;
    }
}

// --------------------
// カード生成
// --------------------
function createCard(number, isFront) {
    const card = document.createElement("div");
    card.classList.add("card");

    if (isFront) {
        card.classList.add("front");
        card.textContent = number;
        card.addEventListener("click", () => onCardClick(card));
    } else {
        card.classList.add("back");
    }

    card.dataset.number = number;
    return card;
}

// --------------------
// クリック処理
// --------------------
function onCardClick(card) {
    // 選択済みカードがない場合
    if (!selectedCard) {
        selectedCard = card;
        card.classList.add("selected");
        return;
    }

    // 同じカードを押したら解除
    if (selectedCard === card) {
        card.classList.remove("selected");
        selectedCard = null;
        return;
    }

    // 2回目クリック：移動判定
    const fromNumber = Number(selectedCard.dataset.number);
    const toNumber = Number(card.dataset.number);

    if (fromNumber + 1 === toNumber) {
        moveCardsStack(selectedCard, card.parentElement);
    }

    selectedCard.classList.remove("selected");
    selectedCard = null;
}

// カードの塊をまとめて移動
function moveCardsStack(card, targetSlot) {
    const fromSlot = card.parentElement;
    const cardsInFromSlot = Array.from(fromSlot.querySelectorAll(".card"));

    // クリックしたカード以降のカードすべてをまとめて移動
    const movingCards = cardsInFromSlot.slice(cardsInFromSlot.indexOf(card));

    movingCards.forEach((c, i) => {
        c.remove();
        c.style.top = `${(targetSlot.children.length + i) * 20}px`;
        targetSlot.appendChild(c);
    });

    // 元の列の新しい一番上のカードを表に
    const remainingCards = fromSlot.querySelectorAll(".card");
    if (remainingCards.length > 0) {
        const topCard = remainingCards[remainingCards.length - 1];
        topCard.classList.remove("back");
        topCard.classList.add("front");
        topCard.textContent = topCard.dataset.number;
        topCard.addEventListener("click", () => onCardClick(topCard));
    }
}
