// Initialize game variables
let deck = [];
let playerHand = [];
let dealerHand = [];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

// Initialize money variables
let playerMoney = 100;
let bet = 0;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    shuffleDeck();
}

function loadPage() {
    disableHitStand()
    document.getElementById('player-money').textContent = `${playerMoney}`;
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
}

function startGame() {
    createDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    showHands();
    if (playerScore + dealerScore == 42) {
        disableHitStand();
        document.getElementById('status').textContent = "DOUBLE BLACKJACK! PUSH! A TIE!"
    } else if (playerScore == 21) {
        disableHitStand();
        document.getElementById('status').textContent = "Blackjack! Player Wins!";
    } else if (dealerScore == 21) {
        disableHitStand();
        document.getElementById('status').textContent = "Blackjack! Dealer Wins";
    } else {
        document.getElementById('status').textContent = "Hit or Stand?";
        enableHitStand();
        document.getElementById('double-button').disabled = false;        
    }
}

function drawCard() {
    return deck.pop();
}

function showHands() {
    document.getElementById('player-cards').textContent = `Player's cards: ${handToString(playerHand)}`;
    document.getElementById('dealer-cards').textContent = `Dealer's cards: ${handToString(dealerHand)}`;
}

function handToString(hand) {
    return hand.map(card => `${card.value} of ${card.suit}`).join(', ');
}

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;
    for (let card of hand) {
        if (card.value === 'Ace') {
            aceCount++;
            score += 11;
        } else if (['Jack', 'Queen', 'King'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}

function playerHits() {
    playerHand.push(drawCard());
    if (calculateScore(playerHand) > 21) {
        disableHitStand();
        showHands();
        document.getElementById('status').textContent = 'Player busts! Dealer wins.';
    } else {
        showHands();
    }
}

function playerStands() {
    disableHitStand();
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(drawCard());
        showHands();
    }
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    let result = '';
    if (dealerScore > 21) {
        result = 'Dealer busts! Player wins!';
    } else if (playerScore > dealerScore) {
        result = 'Player wins!';
    } else if (playerScore < dealerScore) {
        result = 'Dealer wins!';
    } else {
        result = 'Push! It\'s a tie!';
    }
    document.getElementById('status').textContent = result;
    showHands();
}

function disableHitStand() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('double-button').disabled = true;
}

function enableHitStand() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;  
}

function doubleDown() {
    // bet *= 2;
    playerHand.push(drawCard());
    playerStands();
}