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

var line1;
var line2;
var graphics;

function create ()
{
    graphics = this.add.graphics();

    line1 = new Phaser.Geom.Line(260, 200, 450, 450);
    line2 = new Phaser.Geom.Line(300, 400, 500, 500);

    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeLineShape(line1);
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeLineShape(line2);

    this.input.on('pointermove', function (pointer) {

        line2.x2 = pointer.x;
        line2.y2 = pointer.y;

    });
}

function update ()
{
    Phaser.Geom.Line.Rotate(line1, 0.02);

    graphics.clear();
    graphics.fillStyle(0xffffff);
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeLineShape(line1);

    var p = { x: 0, y: 0 };

    if (Phaser.Geom.Intersects.LineToLine(line1, line2, p))
    {
        graphics.lineStyle(2, 0xff0000);
        graphics.fillPointShape(p, 4);
    }
    else
    {
        graphics.lineStyle(2, 0xffff00);
    }

    graphics.strokeLineShape(line2);
}
