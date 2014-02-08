
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var mushroom;
var texture;
var image;

function create() {

	texture = game.add.renderTexture('mousetrail', 800, 600);

	//	We create a sprite (rather than using the factory) so it doesn't get added to the display, as we only need its texture data.
	mushroom = new Phaser.Sprite(game, 0, 0, 'mushroom');
	mushroom.anchor.setTo(0.5, 0.5);

	//	This is the sprite that is drawn to the display. We've given it the renderTexture as its texture.
	image = game.add.image(0, 0, texture);

	game.input.onDown.add(tint, this);

}

function tint() {

	image.tint = Math.random() * 0xFFFFFF;

}

function update() {

	if (!game.input.activePointer.position.isZero())
	{
		//	Here we draw the mushroom sprite to the renderTexture at the pointer coordinates.
		//	The 'false' parameter 2nd from the end tells it not to clear itself, causing the trail effect you see.
		texture.render(mushroom, game.input.activePointer.position, false);
	}

}

function render() {

}
