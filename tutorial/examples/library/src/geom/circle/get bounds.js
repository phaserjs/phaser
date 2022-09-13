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
var bounds;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000ff }, fillStyle: { color: 0x00ff00 }});

    circle = new Phaser.Geom.Circle(400, 300, 50);

    // if we omit the out parameter, we get a new Rectangle instance
    bounds = Phaser.Geom.Circle.GetBounds(circle);
}

function update ()
{
    a += 0.01;

    if (a > Math.PI * 2)
    {
        a -= Math.PI * 2;
    }

    circle.x = 400 - Math.cos(a) * 350;
    circle.y = 300 - Math.sin(a * 2) * 250;
    circle.radius = Math.sin(a) * Math.sin(a) * 50;

    // or we can supply a Rectangle instance to modify
    Phaser.Geom.Circle.GetBounds(circle, bounds);

    graphics.clear();

    graphics.fillCircleShape(circle);

    graphics.strokeRectShape(bounds);
}
