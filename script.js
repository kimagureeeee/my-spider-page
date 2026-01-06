const slots = document.querySelectorAll(".slot");

// --------------------
// 完成カード置き場（左下）
// --------------------
const completedArea = document.createElement("div");
completedArea.style.position = "fixed";
completedArea.style.left = "10px";
completedArea.style.bottom = "10px";
completedArea.style.display = "flex";
completedArea.style.gap = "10px";
document.body.appendChild(completedArea);

// --------------------
// カード準備（2スート×2デッキ = 52枚）
// --------------------
const suits = ["♤", "♢"];
const numbers = Array.from({ length: 13 }, (_, i) => i + 1);

let cards = [];
for (let d = 0; d < 2; d++) {
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

// --------------------
// 初期配置
// --------------------
const counts = [6,6,6,6,6,6,6,6,5,5];
let index = 0;
let selectedCard = null;

for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    for (let j = 0; j < counts[i]; j++) {
        const data = cards[index++];
        const isFront = j === counts[i] - 1;
        const card = createCard(data.number, data.suit, isFront);
        card.style.top = `${j * 20}px`;
        card.style.left = "5px";
        slot.appendChild(card);
    }
}

// --------------------
// カード生成
// --------------------
function createCard(number, suit, isFront) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.number = number;
    card.dataset.suit = suit;

    if (isFront) {
        card.classList.add("front");
        setLabel(card);
        card.addEventListener("click", () => onCardClick(card));
    } else {
        card.classList.add("back");
    }
    return card;
}

function setLabel(card) {
    card.innerHTML = "";
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = `${card.dataset.number}${card.dataset.suit}`;
    card.appendChild(label);
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

    moveCardsStack(selectedCard, card.parentElement);

    selectedCard.classList.remove("selected");
    selectedCard = null;
}

// --------------------
// 同一スート連番チェック（移動用）
// --------------------
function isValidStack(cards) {
    for (let i = 0; i < cards.length - 1; i++) {
        const n1 = Number(cards[i].dataset.number);
        const n2 = Number(cards[i + 1].dataset.number);
        const s1 = cards[i].dataset.suit;
        const s2 = cards[i + 1].dataset.suit;
        if (n1 !== n2 + 1 || s1 !== s2) return false;
    }
    return true;
}

// --------------------
// カード塊移動
// --------------------
function moveCardsStack(card, targetSlot) {
    const fromSlot = card.parentElement;
    if (fromSlot === targetSlot) return;

    const fromCards = Array.from(fromSlot.querySelectorAll(".card"));
    const movingCards = fromCards.slice(fromCards.indexOf(card));

    // ★ 移動できる塊は同一スート連番のみ
    if (!isValidStack(movingCards)) return;

    // ★ 置き先判定：一番上のカードと数字が連番ならOK（スート不問）
    const targetCards = Array.from(targetSlot.querySelectorAll(".card"));
    if (targetCards.length > 0) {
        const top = targetCards[targetCards.length - 1];
        const fromNum = Number(movingCards[0].dataset.number);
        const toNum = Number(top.dataset.number);
        if (fromNum + 1 !== toNum) return;
    }

    // 移動
    movingCards.forEach((c, i) => {
        c.remove();
        c.style.top = `${(targetSlot.children.length + i) * 20}px`;
        c.style.left = "5px";
        targetSlot.appendChild(c);
    });

    flipTop(fromSlot);
    checkComplete(targetSlot);
}

// --------------------
// 裏カードを表に
// --------------------
function flipTop(slot) {
    const cards = slot.querySelectorAll(".card");
    if (cards.length === 0) return;

    const top = cards[cards.length - 1];
    if (top.classList.contains("back")) {
        top.classList.remove("back");
        top.classList.add("front");
        setLabel(top);
        top.addEventListener("click", () => onCardClick(top));
    }
}

// --------------------
// 1〜13 完成チェック
// --------------------
function checkComplete(slot) {
    const cards = Array.from(slot.querySelectorAll(".card"));
    if (cards.length < 13) return;

    const last13 = cards.slice(-13);
    const suit = last13[0].dataset.suit;

    for (let i = 0; i < 13; i++) {
        if (
            Number(last13[i].dataset.number) !== 13 - i ||
            last13[i].dataset.suit !== suit
        ) return;
    }

    last13.forEach(c => c.remove());
    flipTop(slot);
    createCompletedCard(suit);
}

// --------------------
// 完成カード生成
// --------------------
function createCompletedCard(suit) {
    const card = document.createElement("div");
    card.classList.add("card", "front");
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = `1～13${suit}`;
    card.appendChild(label);
    completedArea.appendChild(card);
}
