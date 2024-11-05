import Phaser from '../node_modules/phaser/dist/phaser.js';
import MainMenuScene from './MainMenuScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenuScene],
    // Additional configurations as needed
};

const game = new Phaser.Game(config);