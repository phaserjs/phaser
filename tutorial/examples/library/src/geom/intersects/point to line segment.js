var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    var line = new Phaser.Geom.Line(300, 200, 500, 400);
    var point = new Phaser.Geom.Point(200, 100);

    this.input.on('pointermove', function (pointer) {

        point.x = Math.round(pointer.x / 10) * 10;
        point.y = Math.round(pointer.y / 10) * 10;

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        graphics.lineStyle(2, 0x00ff00);
        graphics.strokeLineShape(line);

        if (Phaser.Geom.Intersects.PointToLineSegment(point, line))
        {
            graphics.fillStyle(0xff0000);
        }
        else
        {
            graphics.fillStyle(0xffff00);
        }

        graphics.fillPointShape(point, 5);
    }
}
