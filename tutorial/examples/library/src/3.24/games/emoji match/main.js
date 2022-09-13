//  Based on the Emoji Match game by Tom Miller (https://codepen.io/creativeocean/full/OeKjmp)

import Boot from './Boot.js';
import Preloader from './Preloader.js';
import MainMenu from './MainMenu.js';
import MainGame from './Game.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#008eb0',
    parent: 'phaser-example',
    scene: [ Boot, Preloader, MainMenu, MainGame ]
};

let game = new Phaser.Game(config);
