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

var graphics;
var circle;
var point;
var a = 0;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    circle = new Phaser.Geom.Circle(400, 300, 200);
    point = new Phaser.Geom.Rectangle(0, 0, 16, 16);
}

function update ()
{
    a += 0.005;

    if (a > 1)
    {
        a = 0;
    }

    circle.getPoint(a, point);

    graphics.clear();
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeCircleShape(circle);

    graphics.fillStyle(0xff00ff);
    graphics.fillRect(point.x - 8, point.y - 8, point.width, point.height);
}
