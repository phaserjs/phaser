var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};


var text;
var bounds;
var graphics;
var game = new Phaser.Game(config);

function preload() 
{
    this.load.bitmapFont('atari', 'assets/fonts/bitmap/atari-smooth.png', 'assets/fonts/bitmap/atari-smooth.xml');
    this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
    this.load.bitmapFont('hyper', 'assets/fonts/bitmap/hyperdrive.png', 'assets/fonts/bitmap/hyperdrive.xml');
}

function create() 
{
    text = this.add.bitmapText(32, 100, 'hyper', 'Arkanoid\nRevenge of Doh', 96);
    graphics = this.add.graphics(0, 0);
    bounds = text.getTextBounds();
    graphics.lineStyle(1, 0x00FF00, 1.0);
    graphics.strokeRect(bounds.global.x, bounds.global.y, bounds.global.width, bounds.global.height);
}
