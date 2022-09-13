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

var rect;
var point;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa }, fillStyle: { color: 0xaa0000 }});

    rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);
    point = new Phaser.Geom.Circle(0, 0, 10);
}

function update ()
{
    a += 0.015;

    if (a > Math.PI * 2)
    {
        a -= Math.PI * 2;
    }

    point.x = 400 - Math.cos(a) * 400;
    point.y = 300 - Math.sin(a * 2) * 300;

    graphics.clear();
    graphics.strokeRectShape(rect);

    if(Phaser.Geom.Rectangle.ContainsPoint(rect, point))
    {
        graphics.fillStyle(0xaa0000);
    }
    else
    {
        graphics.fillStyle(0x0000aa);
    }

    graphics.fillCircleShape(point);
}
