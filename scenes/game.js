// GameScene.js
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        const suits = ['S', 'H', 'D', 'C']; // Spades, Hearts, Diamonds, Clubs
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

        // Dynamically load all card images
        suits.forEach(suit => {
            ranks.forEach(rank => {
                const cardKey = `${rank}${suit}`;
                this.load.image(cardKey, `assets/cards/${cardKey}.png`);
            });
        });

        // Load button image
        this.load.image('dealButton', 'assets/ui/hit.png');
    }

    create() {
        // Add a "Deal" button
        const dealButton = this.add.image(400, 500, 'dealButton').setInteractive();

        // Handle button click
        dealButton.on('pointerdown', () => {
            this.dealCards();
        });
    }

    dealCards() {
        // Randomly select a card for the dealer
        const dealerCard = this.getRandomCard();
        this.add.image(300, 200, dealerCard).setScale(0.1);

        // Randomly select a card for the player
        const playerCard = this.getRandomCard();
        this.add.image(300, 400, playerCard).setScale(0.1);
    }

    getRandomCard() {
        const suits = ['S', 'H', 'D', 'C'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const randomRank = ranks[Math.floor(Math.random() * ranks.length)];

        return `${randomRank}${randomSuit}`;
    }

    update() {
        // Game logic goes here
    }
}