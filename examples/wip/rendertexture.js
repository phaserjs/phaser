
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var mushroom;
var texture;
var image;

function create() {

	//	Here we'll create a renderTexture the same size as our game
	texture = game.add.renderTexture('mousetrail', 800, 600);

	//	This is the sprite that will be drawn to the texture, we set it to visible false as we only need its texture data
	mushroom = game.add.sprite(0, 0, 'mushroom');
	// mushroom.visible = false;
	// mushroom.anchor.setTo(0.5, 0.5);

	//	This is the sprite that is drawn to the display. We've given it the renderTexture as its texture.
	// game.add.image(0, 0, texture);


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
		//	The final 'true' parameter tells it to render sprites even with visible false set.
		// texture.render(mushroom, game.input.activePointer.position, false, true);
	}

}

function render() {

	game.debug.renderText(game.input.x, 32, 32);

}
