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
        this.load.image('playButton', 'assets/ui/play.png');
        this.load.image('hitButton', 'assets/ui/hit.png');
        this.load.image('standButton', 'assets/ui/stand.png');
    }

    create() {
        // Add a "Play" button
        const playButton = this.add.image(400, 300, 'playButton').setInteractive();
    
        // Add a "Hit" button (initially hidden)
        const hitButton = this.add.image(300, 500, 'hitButton').setInteractive().setVisible(false);

        // Add a "Stand" button (initially hidden)
        const standButton = this.add.image(500, 500, 'standButton').setInteractive().setVisible(false);

    
        // Handle "Play" button click
        playButton.on('pointerdown', () => {
            this.dealCards();
            playButton.setVisible(false); // Hide the "Play" button
            hitButton.setVisible(true);  // Show the "Hit" button
            standButton.setVisible(true); // Show the "Stand" button
        });
    
        // Handle "Hit" button click
        hitButton.on('pointerdown', () => {
            this.addCardToPlayer();
        });

        // Handle "Stand" button click
        standButton.on('pointerdown', () => {
            this.addCardToDealer(); // Add one last card to the player
        });
    }

    dealCards() {
        // Randomly select a card for the dealer
        const dealerCard = this.getRandomCard();
        this.add.image(300, 200, dealerCard).setScale(0.1);

        // Randomly select a card for the player
        const playerCard = this.getRandomCard();
        this.add.image(300, 400, playerCard).setScale(0.1);

        // Initialize player card position offset
        this.playerCardOffset = 0;

        // Initialize dealer card position offset
        this.dealerCardOffset = 0;
    }

    addCardToPlayer() {
        // Increment the player's card position offset
        this.playerCardOffset += 50;
    
        // Randomly select a new card for the player
        const newCard = this.getRandomCard();
        this.add.image(300 + this.playerCardOffset, 400, newCard).setScale(0.1);
    }

    addCardToDealer() {
        // Initialize dealer's hand if not already done
        if (!this.dealerCards) {
            this.dealerCards = [];
        }
    
        // Increment the dealer's card position offset
        this.dealerCardOffset += 50;
    
        // Randomly select a new card for the dealer
        const newCard = this.getRandomCard();
        this.dealerCards.push(newCard);
    
        // Add the card visually
        this.add.image(300 + this.dealerCardOffset, 200, newCard).setScale(0.1);
    
        // Calculate the dealer's total hand value
        const dealerTotal = this.calculateHandValue(this.dealerCards);
    
        // Check if the dealer bursts or wins
        if (dealerTotal > 21) {
            console.log('Dealer bursts with total:', dealerTotal);
        } else if (dealerTotal >= 17) {
            console.log('Dealer stands with total:', dealerTotal);
        } else {
            // Continue adding cards if dealer's total is less than 17
            this.time.delayedCall(1000, () => this.addCardToDealer());
        }
    }
    
    calculateHandValue(cards) {
        let total = 0;
        let aces = 0;
    
        cards.forEach(card => {
            const rank = card[0]; // Get the rank (e.g., 'A', '2', 'K', etc.)
            if (rank === 'A') {
                aces += 1;
                total += 11; // Initially count Ace as 11
            } else if (['K', 'Q', 'J', 'T'].includes(rank)) {
                total += 10; // Face cards and 'T' (10) are worth 10
            } else {
                total += parseInt(rank); // Numeric cards are worth their value
            }
        });
    
        // Adjust for Aces if total exceeds 21
        while (total > 21 && aces > 0) {
            total -= 10; // Count Ace as 1 instead of 11
            aces -= 1;
        }
    
        return total;
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