
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', 'assets/pics/questar.png');
	game.load.image('mask1', 'assets/pics/mask-test.png');
	game.load.image('mask2', 'assets/pics/mask-test2.png');

}

var pic;

function create() {

	var bmd = game.make.bitmapData(320, 256);

	bmd.alphaMask('pic', 'mask2');

	pic = game.add.sprite(0, 0, bmd);

	pic.scale.set(2);

}

function update() {


}

function render() {

}
