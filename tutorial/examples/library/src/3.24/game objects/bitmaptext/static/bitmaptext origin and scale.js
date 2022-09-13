var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
}

function create()
{
    var text = this.add.bitmapText(0, 0, 'ice', 'Phaser 3\nBitmap Text\nOrigin and Scale', 48, 1);

    text.setOrigin(0.5, 0.5);
    text.setPosition(400, 300);
    text.setScale(-2, 2);

    var bounds = text.getTextBounds();

    var debug = this.add.graphics();

    debug.lineStyle(1, 0x00ff00);
    debug.strokeRect(bounds.global.x, bounds.global.y, bounds.global.width, bounds.global.height);
}
