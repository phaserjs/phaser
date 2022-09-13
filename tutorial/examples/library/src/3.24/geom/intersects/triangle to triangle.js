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
var triangleB;
var graphics;

function create ()
{
    graphics = this.add.graphics();

    // triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 320, 140);
    triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 320, 40);

    triangleB = new Phaser.Geom.Triangle(400, 200, 300, 300, 500, 300);

    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeTriangleShape(triangleB);
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeTriangleShape(triangle);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Triangle.CenterOn(triangle, pointer.x, pointer.y);

    });
}

function update ()
{
    Phaser.Geom.Triangle.Rotate(triangleB, 0.02);

    graphics.clear();
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeTriangleShape(triangleB);

    if (Phaser.Geom.Intersects.TriangleToTriangle(triangle, triangleB))
    {
        graphics.lineStyle(2, 0xff0000);
    }
    else
    {
        graphics.lineStyle(2, 0xffff00);
    }

    graphics.strokeTriangleShape(triangle);
}
