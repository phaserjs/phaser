var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');

}

var sprite1;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(350, 300, 'atari');
    sprite1.name = 'atari';
    sprite1.anchor.setTo(0.5, -2);

}

function update() {

    sprite1.angle += 1;

}


function render() {

    game.debug.spriteCorners(sprite1);

}

