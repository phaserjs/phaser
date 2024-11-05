import { MainMenuScene } from './MainMenuScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenuScene]
};

const game = new Phaser.Game(config);