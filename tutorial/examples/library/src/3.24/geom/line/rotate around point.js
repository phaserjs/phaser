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

var lines;
var points;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } });

    lines = [
        new Phaser.Geom.Line(200, 400, 400, 400),
        new Phaser.Geom.Line(400, 400, 600, 400),
        new Phaser.Geom.Line(300, 100, 500, 100),
        new Phaser.Geom.Line(700, 200, 700, 400)
    ];

    points = [
        lines[0].getPointA(),
        lines[1].getPointB(),
        Phaser.Geom.Line.GetMidPoint(lines[2]),
        { x: 400, y: 300}
    ];
}

function update ()
{

    graphics.clear();

    for(var i = 0; i < lines.length; i++)
    {
        Phaser.Geom.Line.RotateAroundPoint(lines[i], points[i], 0.02);

        graphics.strokeLineShape(lines[i]);

        graphics.fillPointShape(points[i], 10);
    }
}
