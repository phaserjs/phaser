
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);

}

var sprite;

function create() {

	game.stage.backgroundColor = '#124184';

	game.physics.gravity.y = 200;

    sprite = game.add.sprite(200, 250, 'gameboy', 4);
    sprite.name = 'green';
    sprite.body.collideWorldBounds = true;
    // sprite.anchor.setTo(0.5, 0.5);

    sprite.body.bounce.setTo(0.9, 0.9);
    sprite.body.velocity.x = 150;

}

function update() {

	// sprite.worldTransform[2] += 1;

}

function render() {

	game.debug.bodyInfo(sprite, 32, 32);
	game.debug.physicsBody(sprite.body);

}
