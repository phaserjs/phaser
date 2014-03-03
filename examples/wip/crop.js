
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var image;
var image2;
var r;

function create() {

	image = game.add.image(32, 50, 'pic');
	image2 = game.add.image(32, 250, 'pic');

	r = new Phaser.Rectangle(0, 0, 0, 176);

	image2.crop(r);

}

function update() {

	if (r !== null)
	{
		r.width += 1;

		image2.crop(r);

		if (r.width == 720)
		{
			image2.crop();
			r = null;
		}
	}

}

function render() {

	game.debug.text(image2.width, 32, 32);

}
