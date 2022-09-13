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
    this.load.image('turkey', 'assets/pics/turkey-1985086.jpg');
}

function create ()
{
    this.add.image(400, 300, 'turkey');

    var graphics = this.add.graphics();

    // var color = 0xffffff; // diff
    var color = 0x0000ff; // mult
    var thickness = 4;
    var alpha = 1;

    // graphics.lineStyle(16, 0x000000, 1);
    graphics.fillStyle(color, alpha);

    // var a = new Phaser.Geom.Point(400, 300);
    // var radius = 128;

    graphics.fillCircle(400, 300, 128);
    // graphics.strokeCircle(400, 300, 128);

    // graphics.setBlendMode(Phaser.BlendModes.MULTIPLY);
    graphics.setBlendMode(Phaser.BlendModes.SCREEN);
    // graphics.setBlendMode(Phaser.BlendModes.DIFFERENCE);
}
