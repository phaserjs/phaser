
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('bg', 'assets/pics/color_wheel_swirl.png');
	game.load.image('pic', 'assets/pics/questar.png');
	game.load.image('mask1', 'assets/pics/mask-test.png');
	game.load.image('mask2', 'assets/pics/mask-test2.png');

}

var pic;
var mask;

function create() {

	var bmd = game.make.bitmapData(320, 200);

	// bmd.draw('pic');

	bmd.alphaMask('pic', 'mask2');

	pic = game.add.sprite(0, 0, bmd);

	// game.add.image(-200, 0, 'bg');

	// mask = game.add.sprite(0, 0, 'mask1');

	// pic = game.add.sprite(0, 0, 'pic');

	// mask.addChild(pic);

	// pic.blendMode = Phaser.blendModes.NORMAL;
	// pic.blendMode = Phaser.blendModes.ADD;
	// pic.blendMode = Phaser.blendModes.MULTIPLY;
	// pic.blendMode = Phaser.blendModes.SCREEN;
	// mask.blendMode = Phaser.blendModes.OVERLAY;
	// pic.blendMode = Phaser.blendModes.DARKEN;
	// pic.blendMode = Phaser.blendModes.LIGHTEN;
	// pic.blendMode = Phaser.blendModes.COLOR_DODGE;
	// pic.blendMode = Phaser.blendModes.COLOR_BURN;
	// pic.blendMode = Phaser.blendModes.HARD_LIGHT;
	// pic.blendMode = Phaser.blendModes.SOFT_LIGHT;
	// pic.blendMode = Phaser.blendModes.DIFFERENCE;
	// pic.blendMode = Phaser.blendModes.EXCLUSION;
	// pic.blendMode = Phaser.blendModes.HUE;
	// pic.blendMode = PIXI.blendModes.SATURATION;
	// pic.blendMode = Phaser.blendModes.COLOR;
	// pic.blendMode = Phaser.blendModes.LUMINOSITY;

}

function update() {


}

function render() {

}
