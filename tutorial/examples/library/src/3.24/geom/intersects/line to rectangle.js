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

var line;
var rect;
var graphics;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    line = new Phaser.Geom.Line(260, 200, 550, 400);
    rect = new Phaser.Geom.Rectangle(32, 32, 128, 96);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Rectangle.CenterOn(rect, pointer.x, pointer.y);

    });
}

function update ()
{
    Phaser.Geom.Line.Rotate(line, 0.01);

    graphics.clear();

    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeLineShape(line);

    if (Phaser.Geom.Intersects.LineToRectangle(line, rect))
    {
        graphics.lineStyle(2, 0xff0000);
    }
    else
    {
        graphics.lineStyle(2, 0xffff00);
    }

    graphics.strokeRectShape(rect, 2);
}
