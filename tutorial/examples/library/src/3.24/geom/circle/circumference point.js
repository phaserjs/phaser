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
var circle;
var point;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0x00ff00 } });

    circle = new Phaser.Geom.Circle(400, 300, 150);
    point = new Phaser.Geom.Rectangle(0, 0, 8, 8);
}

function update ()
{
    a += 0.04;

    if (a >= Phaser.Math.PI2)
    {
        a -= Phaser.Math.PI2;
    }

    Phaser.Geom.Circle.CircumferencePoint(circle, a, point);

    graphics.clear();
    graphics.fillRect(point.x - 4, point.y - 4, point.width, point.height);
}