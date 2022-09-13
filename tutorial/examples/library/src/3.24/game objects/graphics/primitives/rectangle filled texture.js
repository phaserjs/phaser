var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('metal', 'assets/textures/alien-metal.jpg');
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
}

function create ()
{
    var graphics = this.add.graphics();

    graphics.setTexture('megaset', 'contra1');

    graphics.fillStyle(0x00ff00);
    graphics.fillRect(100, 100, 256, 256);

    graphics.setTexture('megaset', 'dragonwiz', 1);

    graphics.fillGradientStyle(0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 1);
    graphics.fillRect(350, 300, 256, 256);
}
