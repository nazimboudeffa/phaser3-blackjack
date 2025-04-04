// main.js
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#007f0e',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH},
        scene: [BootScene, GameScene],
};

const game = new Phaser.Game(config);