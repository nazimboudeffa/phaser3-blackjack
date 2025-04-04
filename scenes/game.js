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
        this.load.image('playButton', 'assets/ui/deal.png');
        this.load.image('hitButton', 'assets/ui/hit.png');
        this.load.image('standButton', 'assets/ui/stand.png');
    }

    create() {
        // Add a green background
        this.add.rectangle(400, 300, 800, 600, 0x008000); // Green background
    
        // Create and shuffle the deck
        if (!this.deck) {
            this.deck = this.createDeck();
        }
    
        // Add a "Play" button
        this.playButton = this.add.image(400, 300, 'playButton').setInteractive();
    
        // Add a "Hit" button (initially hidden)
        this.hitButton = this.add.image(300, 500, 'hitButton').setInteractive().setVisible(false);
    
        // Add a "Stand" button (initially hidden)
        this.standButton = this.add.image(500, 500, 'standButton').setInteractive().setVisible(false);
    
        // Add a text object to display the player's hand value
        this.playerHandValueText = this.add.text(270, 320, 'Player: 0', {
            fontSize: '12px',
            color: '#ffffff',
        });

        // Add a text object to display the dealer's hand value
        this.dealerHandValueText = this.add.text(270, 270, 'Dealer: 0', {
            fontSize: '12px',
            color: '#ffffff',
        });
    
        // Handle "Play" button click
        this.playButton.on('pointerdown', () => {
            this.dealCards();
            this.playButton.setVisible(false); // Hide the "Play" button
            this.hitButton.setVisible(true);  // Show the "Hit" button
            this.standButton.setVisible(true); // Show the "Stand" button
    
            // Update the player's and dealer's hand values after dealing cards
            const playerTotal = this.calculateHandValue(this.playerCards);
            const dealerTotal = this.calculateHandValue(this.dealerCards);
            this.playerHandValueText.setText(`Player: ${playerTotal}`);
            this.dealerHandValueText.setText(`Dealer: ${dealerTotal}`);
        });
    
        // Handle "Hit" button click
        this.hitButton.on('pointerdown', () => {
            this.addCardToPlayer();
        });
    
        // Handle "Stand" button click
        this.standButton.on('pointerdown', () => {
            this.addCardToDealer(); // Add one last card to the player
            this.time.delayedCall(1500, () => this.checkWinner()); // Check the winner after the dealer finishes
        });
    }

    checkWinner() {
        const playerTotal = this.calculateHandValue(this.playerCards);
        const dealerTotal = this.calculateHandValue(this.dealerCards);
    
        if (playerTotal > 21) {
            console.log('Player busts! Dealer wins.');
        } else if (dealerTotal > 21) {
            console.log('Dealer busts! Player wins.');
        } else if (playerTotal > dealerTotal) {
            console.log(`Player wins with ${playerTotal} against Dealer's ${dealerTotal}.`);
        } else if (dealerTotal > playerTotal) {
            console.log(`Dealer wins with ${dealerTotal} against Player's ${playerTotal}.`);
        } else {
            console.log(`It's a tie! Both have ${playerTotal}.`);
        }

        // Add a "Click to Continue" button
        const continueButton = this.add.text(400, 300, 'Click to Continue', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();

        // Restart the game when the button is clicked
        continueButton.on('pointerdown', () => {
            this.scene.restart(); // Restart the scene to reset the game
        });

        // Hide the "Hit" and "Stand" buttons
        this.hitButton.setVisible(false);
        this.standButton.setVisible(false);
    }

    addCardToPlayer() {
        // Increment the player's card position offset
        this.playerCardOffset += 50;
    
        // Draw a card from the deck
        const newCard = this.deck.pop();
        this.playerCards.push(newCard);
    
        // Add the card visually
        this.add.image(300 + this.playerCardOffset, 400, newCard).setScale(0.1);
    
        // Calculate the player's total hand value
        const playerTotal = this.calculateHandValue(this.playerCards);
    
        // Update the player's hand value text
        this.playerHandValueText.setText(`Player: ${playerTotal}`);
    
        // Check if the player bursts
        if (playerTotal > 21) {
            console.log('Player busts with total:', playerTotal);
    
            // Add a "Click to Continue" button
            const continueButton = this.add.text(400, 300, 'Click to Continue', {
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 },
            }).setOrigin(0.5).setInteractive();
    
            // Restart the game when the button is clicked
            continueButton.on('pointerdown', () => {
                this.scene.restart(); // Restart the scene to reset the game
            });
    
            // Hide the "Hit" and "Stand" buttons
            this.hitButton.setVisible(false);
            this.standButton.setVisible(false);
        }
    }

    addCardToDealer() {
        // Increment the dealer's card position offset
        this.dealerCardOffset += 50;
    
        // Draw a card from the deck
        const newCard = this.deck.pop();
        this.dealerCards.push(newCard);
    
        // Add the card visually
        this.add.image(300 + this.dealerCardOffset, 200, newCard).setScale(0.1);
    
        // Calculate the dealer's total hand value
        const dealerTotal = this.calculateHandValue(this.dealerCards);
    
        // Update the dealer's hand value text
        this.dealerHandValueText.setText(`Dealer: ${dealerTotal}`);
    
        // Check if the dealer bursts or stands
        if (dealerTotal >= 17) {
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

    createDeck() {
        const suits = ['S', 'H', 'D', 'C']; // Spades, Hearts, Diamonds, Clubs
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    
        // Create a full deck of cards
        const deck = [];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                deck.push(`${rank}${suit}`);
            });
        });
    
        // Shuffle the deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    
        return deck;
    }

    dealCards() {
        // Draw a card for the dealer
        const dealerCard = this.deck.pop();
        this.add.image(300, 200, dealerCard).setScale(0.1);
    
        // Draw a card for the player
        const playerCard = this.deck.pop();
        this.add.image(300, 400, playerCard).setScale(0.1);
    
        // Initialize player and dealer card offsets
        this.playerCardOffset = 0;
        this.dealerCardOffset = 0;
    
        // Initialize hands
        this.playerCards = [playerCard];
        this.dealerCards = [dealerCard];
    
        // Update the player's and dealer's hand values
        const playerTotal = this.calculateHandValue(this.playerCards);
        const dealerTotal = this.calculateHandValue(this.dealerCards);
        this.playerHandValueText.setText(`Player: ${playerTotal}`);
        this.dealerHandValueText.setText(`Dealer: ${dealerTotal}`);
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