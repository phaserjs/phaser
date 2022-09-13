var config = {
    type: Phaser.AUTO,
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
    this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
    this.load.bitmapFont('hyper', 'assets/fonts/bitmap/hyperdrive.png', 'assets/fonts/bitmap/hyperdrive.xml');
}

function create() 
{
    var graphics = this.add.graphics({ x: 0, y: 0, fillStyle: { color: 0xff00ff, alpha: 0.6 }, lineStyle: { color: 0x00ff00 } });

    var text1 = this.add.bitmapText(400, 0, 'gothic', 'Phaser 3', 70).setOrigin(0);
    var text2 = this.add.bitmapText(400, 200, 'gothic', 'Phaser 3', 70).setOrigin(0.5);
    var text3 = this.add.bitmapText(400, 400, 'gothic', 'Phaser 3', 70).setOrigin(1);

    var bounds1 = text1.getTextBounds();
    var bounds2 = text2.getTextBounds();
    var bounds3 = text3.getTextBounds();

    graphics.lineBetween(400, 0, 400, 600);

    graphics.fillRect(bounds1.global.x, bounds1.global.y, bounds1.global.width, bounds1.global.height);
    graphics.fillRect(bounds2.global.x, bounds2.global.y, bounds2.global.width, bounds2.global.height);
    graphics.fillRect(bounds3.global.x, bounds3.global.y, bounds3.global.width, bounds3.global.height);
}
