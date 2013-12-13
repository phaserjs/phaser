
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {


}

var snake;
var bmd;
var cursors;

function create() {

	bmd = game.add.bitmapData(32, 32);
	bmd.context.fillStyle = 'rgb(0, 255, 0)';
	bmd.context.fillRect(0, 0, 32, 32);

	snake = game.add.group();

	sprite = game.add.sprite(game.world.randomX - 32, game.world.randomY - 64, bmd);

}

function update() {


}

function render() {

}
