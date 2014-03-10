
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('arrow', 'assets/sprites/arrow.png');
}

var sprite;

function create() {

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'arrow');
    sprite.anchor.setTo(0.5, 0.5);

    //	Enable Arcade Physics for the sprite
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    //	Tell it we don't want physics to manage the rotation
    sprite.body.allowRotation = false;

}

function update() {

    sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 500);

}

function render() {

    game.debug.spriteInfo(sprite, 32, 32);

}
