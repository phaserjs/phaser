var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bounds1;
var bounds2;
var bounds3;

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
    graphics = this.add.graphics({ x: 0, y: 0, fillStyle: { color: 0xff00ff, alpha: 1 } });

    var text1 = this.add.bitmapText(0, 0, 'atari', 'Welcome!', 70);
    var text2 = this.add.bitmapText(0, 160, 'gothic', 'Welcome!', 40);
    var text3 = this.add.bitmapText(0, 300, 'hyper', 'Terminator 2', 128);

    bounds1 = text1.getTextBounds(true);
    bounds2 = text2.getTextBounds(true);
    bounds3 = text3.getTextBounds(true);
}

function update()
{
    graphics.clear();

    graphics.fillRect(bounds1.global.x, bounds1.global.y, bounds1.global.width, bounds1.global.height);
    graphics.fillRect(bounds2.global.x, bounds2.global.y, bounds2.global.width, bounds2.global.height);
    graphics.fillRect(bounds3.global.x, bounds3.global.y, bounds3.global.width, bounds3.global.height);
}
