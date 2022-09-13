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

    graphics.fillGradientStyle(0xff0000, 0xff0000, 0x0000ff, 0x0000ff, 1);

    graphics.fillCircle(300, 300, 200);

    graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);

    graphics.fillCircle(500, 300, 140);
}
