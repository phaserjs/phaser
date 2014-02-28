
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', '../assets/pics/questar.png');

}

var image;
var bmd;

function create() {

	game.add.image(0, 0, 'pic');

	console.log('pic?');

	// bmd = game.add.bitmapData(800, 600);
	// bmd.context.fillStyle = 'rgba(255,0,0,0.2)';
	// bmd.context.fillRect(0, 0, 300, 100);

	// image = game.add.image(0, 0, bmd);

}

function update() {

	// bmd.context.fillRect(game.input.x, game.input.y, 8, 8);

}

function render() {

	// game.debug.renderText(game.input.x, 32, 32);

}
