var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    var curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(100, 100), new Phaser.Math.Vector2(600, 400));

    graphics.lineStyle(1, 0xffffff, 1);

    curve.draw(graphics);

    //  Get 32 points from the curve
    var points = curve.getSpacedPoints(32);

    //  Draw the points
    graphics.fillStyle(0xff0000, 1);

    for (var i = 0; i < points.length; i++)
    {
        graphics.fillCircle(points[i].x, points[i].y, 4);
    }
}
