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

var path;
var curve;
var points;
var graphics;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    path = { t: 0, vec: new Phaser.Math.Vector2() };

    points = [];

    points.push(new Phaser.Math.Vector2(50, 400));
    points.push(new Phaser.Math.Vector2(200, 200));
    points.push(new Phaser.Math.Vector2(350, 300));
    points.push(new Phaser.Math.Vector2(500, 500));
    points.push(new Phaser.Math.Vector2(700, 400));

    curve = new Phaser.Curves.Spline(points);

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 2000,
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(1, 0xffffff, 1);

    curve.draw(graphics, 64);

    graphics.fillStyle(0x00ff00, 1);

    for (var i = 0; i < points.length; i++)
    {
        graphics.fillCircle(points[i].x, points[i].y, 4);
    }

    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(path.vec.x, path.vec.y, 8);
}
