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
var aimLine;
var reflectingLine;
var reflectedLine;
var text;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    aimLine = new Phaser.Geom.Line(100, 100, 400, 300);
    reflectingLine = new Phaser.Geom.Line(250, 300, 550, 300);
    reflectedLine = new Phaser.Geom.Line(250, 300, 550, 300);

    text = this.add.text(50, 50, '');

    this.input.on('pointermove', function (pointer) {

        aimLine.x1 = pointer.x;
        aimLine.y1 = pointer.y;

    });
}

function update ()
{
    Phaser.Geom.Line.Rotate(reflectingLine, 0.005);

    var reflectAngle = Phaser.Geom.Line.ReflectAngle(aimLine, reflectingLine);

    text.setText("Reflect Angle: " + Phaser.Math.RadToDeg(reflectAngle));

    graphics.clear();

    graphics.strokeLineShape(aimLine);

    graphics.lineStyle(4, 0x0000aa);// blue
    graphics.strokeLineShape(reflectingLine);

    var length = Phaser.Geom.Line.Length(aimLine);

    Phaser.Geom.Line.SetToAngle(reflectedLine, 400, 300, reflectAngle, length);

    graphics.lineStyle(2, 0x00aa00);// green
    graphics.strokeLineShape(reflectedLine);
}
