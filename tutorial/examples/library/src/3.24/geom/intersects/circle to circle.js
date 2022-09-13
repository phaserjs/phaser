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
var pointerCircle;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0xaa0000} });

    circle = new Phaser.Geom.Circle(0, 0, 120);

    pointerCircle = new Phaser.Geom.Circle(400, 300, 60);

    this.input.on('pointermove', function (pointer) {

        pointerCircle.x = pointer.x;
        pointerCircle.y = pointer.y;

    });
}

function update ()
{
    a += 0.015;

    if (a > Math.PI * 4)
    {
        a -= Math.PI * 4;
    }

    circle.x = 400 - Math.cos(a / 2) * 400;
    circle.y = 300 - Math.sin(a * 2) * 300;

    graphics.clear();
    graphics.fillCircleShape(circle);

    if (Phaser.Geom.Intersects.CircleToCircle(circle, pointerCircle))
    {
        graphics.lineStyle(4, 0xaa0000);
    }
    else
    {
        graphics.lineStyle(4, 0x00aa00);
    }

    graphics.strokeCircleShape(pointerCircle);
}
