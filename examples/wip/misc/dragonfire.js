
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var background;
var filter;

function preload() {

    game.load.spritesheet('dragon', 'assets/sprites/stormlord-dragon96x64.png', 96, 64);
    game.load.image('sky', 'assets/skies/sky2.png');
    game.load.image('land', 'assets/wip/karamoon.png');
    game.load.script('fire', '../filters/Fire.js');

}

var sky;
var background;
var fire;
var dragon;

function create() {

	sky = game.add.sprite(0, 600, 'sky');
	sky.scale.y = -1;
	sky.alpha = 0.5;

	fire = game.add.sprite(0, 200);
	fire.width = 800;
	fire.height = 400;

	background = game.add.sprite(0, 0, 'land');

	dragon = game.add.sprite(100, 300, 'dragon');
	dragon.animations.add('flyright', [0,1,2,3,4,5], 10, true);
	dragon.play('flyright');

	filter = game.add.filter('Fire', 800, 400);
	filter.alpha = 0.0;
	fire.filters = [filter];

}

function update() {

	filter.update();

}

function render() {

	// filter.update();

}
