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

    var p0 = new Phaser.Math.Vector2(100, 500);
    var p1 = new Phaser.Math.Vector2(50, 100);
    var p2 = new Phaser.Math.Vector2(600, 100);
    var p3 = new Phaser.Math.Vector2(700, 500);

    var curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

    graphics.lineStyle(1, 0xffffff, 1);

    curve.draw(graphics, 64);

    //  16 points evenly spaced out across the curve
    var points = curve.getPoints(16);

    graphics.fillStyle(0x00ff00, 1);

    for (var i = 0; i < points.length; i++)
    {
        graphics.fillCircle(points[i].x, points[i].y, 3);
    }

    var pointA = curve.getPoint(0.95);

    graphics.fillStyle(0xff00ff, 1);
    
    graphics.fillCircle(pointA.x, pointA.y, 3);

}
