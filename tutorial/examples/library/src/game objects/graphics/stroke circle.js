var config = {
    width: 800,
    height: 600,
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

var graphics;

function create ()
{
    graphics = this.add.graphics();

    var color = 0xffff00;
    var thickness = 4;
    var alpha = 1;

    graphics.lineStyle(thickness, color, alpha);

    var a = new Phaser.Geom.Point(400, 300);
    var radius = 128;

    graphics.strokeCircle(a.x, a.y, radius);
}
