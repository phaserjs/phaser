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
var rect;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    circle = new Phaser.Geom.Circle(400, 300, 250);
    rect = new Phaser.Geom.Rectangle(0, 0, 100, 100);
}

function update ()
{
    a += 0.01;

    if (a > Math.PI * 2)
    {
        a -= Math.PI * 2;
    }

    rect.x = 350 - Math.sin(a * 2) * 350;
    rect.y = 250 - Math.cos(a) * 250;

    graphics.clear();
    graphics.strokeCircleShape(circle);

    if(Phaser.Geom.Circle.ContainsRect(circle, rect))
    {
        graphics.fillStyle(0xff0000);
    }
    else
    {
        graphics.fillStyle(0x0000ff);
    }

    graphics.fillRectShape(rect);
}
