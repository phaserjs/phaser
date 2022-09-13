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

    var a = new Phaser.Geom.Point(400, 100);
    var b = new Phaser.Geom.Point(200, 400);
    var c = new Phaser.Geom.Point(600, 400);

    graphics.strokeTriangle(a.x, a.y, b.x, b.y, c.x, c.y);
}
