import Boot from './Boot.js';
import Preloader from './Preloader.js';
import MainMenu from './MainMenu.js';
import MainGame from './Game.js';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    backgroundColor: '#2e91f3',
    parent: 'phaser-example',
    scene: [ Boot, Preloader, MainMenu, MainGame ]
};

let game = new Phaser.Game(config);
