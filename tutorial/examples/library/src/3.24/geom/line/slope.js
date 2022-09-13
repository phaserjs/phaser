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
var slope;
var position;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } });

    line = new Phaser.Geom.Line(150, 400, 550, 450);

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
        slope = Phaser.Geom.Line.Slope(line);

        text.setText("Line Slope: " + slope);
    }
}

function update ()
{
    position += slope;

    position = Phaser.Math.Clamp(position, 0, 100);

    graphics.clear();

    graphics.strokeLineShape(line);

    var point = Phaser.Geom.Line.GetPoint(line, position / 100);

    graphics.fillPointShape(point, 25);
}
