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
    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } });

    var line = new Phaser.Geom.Line(0, 300, 400, 100);

    this.input.on('pointermove', function (pointer) {

        line.x2 = pointer.x;
        line.y2 = pointer.y;

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        var points = Phaser.Geom.Line.BresenhamPoints(line, 30);

        for(var i = 0; i < points.length; i++)
        {

            graphics.fillPointShape(points[i], 30);

        }

        graphics.strokeLineShape(line);

    }
}