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

    graphics.lineGradientStyle(128, 0xff0000, 0xff0000, 0x0000ff, 0x0000ff, 1);

    graphics.lineBetween(100, 100, 600, 500);
}
