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

var circle;
var point;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    circle = new Phaser.Geom.Circle(400, 300, 200);
    point = new Phaser.Geom.Rectangle(0, 0, 16, 16);
}

function update ()
{
    a += 0.01;

    if (a > Math.PI * 2)
    {
        a -= Math.PI * 2;
    }

    point.x = 400 - Math.cos(a) * 400;
    point.y = 300 - Math.sin(a * 2) * 300;

    graphics.clear();
    graphics.strokeCircleShape(circle);

    if(Phaser.Geom.Circle.ContainsPoint(circle, point))
    {
        graphics.fillStyle(0xff0000);
    }
    else
    {
        graphics.fillStyle(0x0000ff);
    }

    graphics.fillRect(point.x - 8, point.y - 8, point.width, point.height);
}
