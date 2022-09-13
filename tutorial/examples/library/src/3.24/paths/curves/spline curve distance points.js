var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var curve;
var points;
var size = 32;
var graphics;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    curve = new Phaser.Curves.Spline([
        50, 300,
        164, 246,
        274, 342,
        412, 257,
        522, 341,
        664, 264
    ]);

    points = curve.getDistancePoints(size);
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(1, 0xffffff, 1);

    curve.draw(graphics, 64);

    graphics.fillStyle(0x00ff00, 1);

    graphics.lineStyle(1, 0x00ff00, 1);

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];

        graphics.fillCircle(p.x, p.y, 2);

        // var x = p.x - (size / 2);
        // var y = p.y - (size / 2);
        // graphics.strokeRect(x, y, size, size);
    }
}
