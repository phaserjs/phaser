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

var line;
var circle;
var graphics;

function create ()
{
    graphics = this.add.graphics();

    line = new Phaser.Geom.Line(260, 200, 450, 450);

    circle = new Phaser.Geom.Circle(300, 400, 60);

    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeLineShape(line);
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeCircleShape(circle);

    this.input.on('pointermove', function (pointer) {

        circle.x = pointer.x;
        circle.y = pointer.y;

    });
}

function update ()
{
    Phaser.Geom.Line.Rotate(line, 0.02);

    graphics.clear();
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeLineShape(line);

    if (Phaser.Geom.Intersects.LineToCircle(line, circle))
    {
        graphics.lineStyle(2, 0xff0000);
    }
    else
    {
        graphics.lineStyle(2, 0xffff00);
    }

    graphics.strokeCircleShape(circle);
}
