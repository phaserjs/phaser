var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    graphics.fillGradientStyle(0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 1);
    graphics.fillRect(100, 100, 256, 256);

    graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    graphics.fillRect(250, 200, 400, 256);

    graphics.fillStyle(0x00ff00, 0.5);
    graphics.fillRect(550, 300, 160, 256);
}
