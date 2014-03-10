
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('arrow', 'assets/sprites/arrow.png');
}

var sprite;

function create() {

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'arrow');
    sprite.anchor.setTo(0.5, 0.5);

    game.physics.enable(sprite, Phaser.Physics.ARCADE);

}

function update() {

    game.physics.arcade.moveToPointer(sprite, game.input.activePointer, 60, 500, 500);

}

function render() {

    game.debug.spriteInfo(sprite, 32, 32);

}
