import { GameStartScene } from './GameStartScene.js';
import { MainMenuScene } from './MainMenuScene.js';

const config = {
    type: Phaser.AUTO,
    width: 540,
    height: 960,
    scene: [MainMenuScene, GameStartScene], // Add both scene here
};

const game = new Phaser.Game(config);