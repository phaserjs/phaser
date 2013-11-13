
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var mushroom;
var texture;

function create() {

	//	Here we'll create a renderTexture the same size as our game
	texture = game.add.renderTexture('mousetrail', 800, 600);

	//	This is the sprite that will be drawn to the texture, we set it to visible false as we only need its texture data
	mushroom = game.add.sprite(0, 0, 'mushroom');
	mushroom.visible = false;
	mushroom.anchor.setTo(0.5, 0.5);

	//	This is the sprite that is drawn to the display. We've given it the renderTexture as its texture.
	game.add.sprite(0, 0, texture);

}

function update() {

	//	Here we draw the mushroom sprite to the renderTexture at the pointer coordinates.
	//	The 'false' parameter at the end tells it not to clear itself, causing the trail effect you see.
	texture.render(mushroom, game.input.activePointer.position, false);

}
