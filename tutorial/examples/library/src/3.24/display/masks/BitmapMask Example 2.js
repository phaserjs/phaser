var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var loadBar;
var t = 0.0;
var text;
var game = new Phaser.Game(config);

function preload() {

    this.load.image('swirl', 'assets/pics/color-wheel-swirl.png');
    this.load.image('checker', 'assets/pics/checker.png');
    this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
}

function create() {


    loadBar = this.add.graphics();

	var checker = this.make.image({
		x: game.config.width / 2,
		y: game.config.height / 2,
		key: 'checker',
		add: true
	});


    var swirl = this.make.sprite({
    	x: game.config.width / 2, 
    	y: game.config.height / 2, 
    	key: 'swirl',
    	add: true
    });

    loadBar.x = game.config.width / 2;
    loadBar.y = game.config.height / 2;

    swirl.mask = new Phaser.Display.Masks.BitmapMask(this, loadBar);
    text = this.add.dynamicBitmapText(game.config.width / 2 - 20, game.config.height / 2 - 15, 'gothic', '0%', 32);

}

function update()
{
    var step = Math.abs(Math.sin(t)) * 400;

    loadBar.clear();
    loadBar.lineStyle(40, 0, 1);
    loadBar.beginPath();
    loadBar.arc(0, 0, 100, 0, Phaser.Math.DegToRad(-step), false);
    loadBar.strokePath();
    loadBar.closePath();

    t += 0.01;

    text.setText((step / 400 * 100).toFixed(0) + '%')
}
