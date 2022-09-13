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
var line;
var text;
var perpSlope;
var position;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } });

    line = new Phaser.Geom.Line(250, 100, 200, 500);

    text = this.add.text(50, 50, '');

    position = 50;

    this.input.on('pointermove', function (pointer) {

        line.x2 = pointer.x;
        line.y2 = pointer.y;

        calculate();
    });

    calculate();

    function calculate()
    {
        perpSlope = Phaser.Geom.Line.PerpSlope(line);

        text.setText("Line Perpendicular Slope: " + perpSlope);
    }
}

function update ()
{
    position += perpSlope;

    position = Phaser.Math.Clamp(position, 0, 250);

    var normal = Phaser.Geom.Line.GetNormal(line);

    var midPoint = Phaser.Geom.Line.GetMidPoint(line);

    graphics.clear();

    graphics.strokeLineShape(line);

    graphics.lineStyle(4, 0x00aa00);
    graphics.lineBetween(midPoint.x, midPoint.y,
        midPoint.x + normal.x * 250,
        midPoint.y + normal.y * 250);

    normal.x *= position;
    normal.y += position;

    graphics.fillCircle(midPoint.x + normal.x, midPoint.y + normal.y, 12);
}
