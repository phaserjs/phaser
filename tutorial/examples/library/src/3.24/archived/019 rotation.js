
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('disk', 'assets/sprites/copy-that-floppy.png');

}

var sprite;

function create() {

    sprite = game.add.sprite(400, 200, 'disk');

}

function update () {

    sprite.rotation += 0.01;

}
