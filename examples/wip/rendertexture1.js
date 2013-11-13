
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

}

var group;
var texture;

function create() {

	group = game.add.group();
	group.create(0, 0, 'veggies', 0);
	group.create(32, 0, 'veggies', 1);
	group.create(0, 32, 'veggies', 2);
	group.create(32, 32, 'veggies', 3);
	group.visible = false;

	texture = game.add.renderTexture('texture', 800, 600);
	
	game.add.sprite(0, 0, texture);

}

function update() {

	var clear = false;

	for (var i = 0; i < 60; i++)
	{
		clear = (i == 0);
		texture.renderXY(group, game.world.randomX, game.world.randomY, clear);
	}

}
