var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', '/phaser/examples/assets/pics/1984-nocooper-space.png');

}

var image;
var bmd;

function create() {

	console.log('pic box 11');

	game.add.sprite(0, 0, 'pic');

	bmd = game.add.bitmapData(800, 600);
	bmd.context.fillStyle = 'rgba(255,0,0,1)';
	bmd.context.fillRect(0, 0, 300, 100);

	image = game.add.image(0, 100, bmd);

}

function update() {

	bmd.context.fillRect(game.input.x, game.input.y, 8, 8);

}

function render() {

	game.debug.text(game.input.x, 32, 32);

}
