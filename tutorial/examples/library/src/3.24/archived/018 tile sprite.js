
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('block', 'assets/sprites/block.png');

}

var tilesprite;

function create() {

    tilesprite = game.add.tileSprite(0, 0, 800, 600, 'block');

}

function update() {

    tilesprite.tilePosition.x += 1;
    tilesprite.tilePosition.y += 1;

}
