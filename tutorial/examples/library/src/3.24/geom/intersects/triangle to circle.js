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

var triangle;
var circle;
var graphics;

function create ()
{
    graphics = this.add.graphics();

    triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 200, 200);

    circle = new Phaser.Geom.Circle(300, 400, 60);

    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeTriangleShape(triangle);
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeCircleShape(circle);

    this.input.on('pointermove', function (pointer) {

        circle.x = pointer.x;
        circle.y = pointer.y;

    });
}

function update ()
{
    Phaser.Geom.Triangle.Rotate(triangle, 0.02);

    graphics.clear();
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeTriangleShape(triangle);

    if (Phaser.Geom.Intersects.TriangleToCircle(triangle, circle))
    {
        graphics.lineStyle(2, 0xff0000);
    }
    else
    {
        graphics.lineStyle(2, 0xffff00);
    }

    graphics.strokeCircleShape(circle);
}
