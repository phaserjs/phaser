var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var graphics;
var step = 0.5;
var point;
var ellipse;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0x00aaaa } });

    ellipse = new Phaser.Geom.Ellipse(380, 280, 20, 0);

    point = new Phaser.Geom.Point(20, 0);
}

function update ()
{
    if (ellipse.y < 600)
    {
        graphics.fillEllipseShape(ellipse);

        Phaser.Geom.Ellipse.OffsetPoint(ellipse, point);

        Phaser.Math.Rotate(point, step);

        ellipse.width = point.x;
        ellipse.height = point.y;

        step  *= 0.996;
    }
}
