
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var image;
var sprite;

function create() {

console.log('wtf');

	image = game.add.image(game.world.centerX, game.world.centerY, 'pic');
	image.anchor.set(0.5);

	// sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'pic');
	// sprite.anchor.set(0.5);

	game.input.onDown.add(tint, this);

}

function tint() {

	image.tint = Math.random() * 0xFFFFFF;
	// sprite.tint = Math.random() * 0xFFFFFF;

}

function update() {

	image.angle += 1;
	// sprite.angle += 1;

}

function render() {

	// game.debug.text(sprite.position.y, 32, 32);

}
