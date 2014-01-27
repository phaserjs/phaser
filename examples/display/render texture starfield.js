
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('star', 'assets/sprites/bullet.png');

}

var star;
var texture1;
var texture2;
var texture3;
var stars = [];

function create() {

	//	This is the sprite that will be drawn to the texture, we set it to visible false as we only need its texture data.
	star = game.add.sprite(0, 0, 'star');
	star.visible = false;

	//	For this effect we'll create a vertical scrolling starfield with 300 stars split across 3 layers.
	//	This will use only 3 textures / sprites in total.
	texture1 = game.add.renderTexture('texture1', 800, 600);
	texture2 = game.add.renderTexture('texture2', 800, 600);
	texture3 = game.add.renderTexture('texture3', 800, 600);
	
	game.add.sprite(0, 0, texture1);
	game.add.sprite(0, 0, texture2);
	game.add.sprite(0, 0, texture3);

	var t = texture1;
	var s = 4;

	//	100 sprites per layer
	for (var i = 0; i < 300; i++)
	{
		if (i == 100)
		{
			//	With each 100 stars we ramp up the speed a little and swap to the next texture
			s = 6;
			t = texture2;
		}
		else if (i == 200)
		{
			s = 7;
			t = texture3;
		}

		stars.push( { x: game.world.randomX, y: game.world.randomY, speed: s, texture: t });
	}

}

function update() {

	for (var i = 0; i < 300; i++)
	{
		//	Update the stars y position based on its speed
		stars[i].y += stars[i].speed;

		if (stars[i].y > 600)
		{
			//	Off the bottom of the screen? Then wrap around to the top
			stars[i].x = game.world.randomX;
			stars[i].y = -32;
		}

		if (i == 0 || i == 100 || i == 200)
		{
			//	If it's the first star of the layer then we clear the texture
			stars[i].texture.renderXY(star, stars[i].x, stars[i].y, true, true);
		}
		else
		{
			//	Otherwise just draw the star sprite where we need it
			stars[i].texture.renderXY(star, stars[i].x, stars[i].y, false, true);
		}
	}

}
