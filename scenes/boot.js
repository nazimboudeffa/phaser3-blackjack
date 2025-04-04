// BootScene.js
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.image('loading', 'assets/cards/back.png');
    }

    create() {
        this.add.image(400, 300, 'loading');
        this.scene.start('GameScene');
    }
}