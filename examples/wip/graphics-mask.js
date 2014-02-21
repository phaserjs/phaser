
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('atari', 'assets/sprites/atari130xe.png');

}

var atari1;
var graphics;

function create() {

	atari1 = game.add.sprite(50, 50, 'atari');

	graphics = game.add.graphics(0, 0);

	graphics.beginFill(0xFF3300);
	graphics.moveTo(0,50);
	graphics.lineTo(250, 50);
	graphics.lineTo(100, 100);
	graphics.lineTo(250, 220);
	graphics.lineTo(50, 220);
	graphics.lineTo(0, 50);
	graphics.endFill();

	atari1.mask = graphics;

}

function update() {


}

function render() {

}
