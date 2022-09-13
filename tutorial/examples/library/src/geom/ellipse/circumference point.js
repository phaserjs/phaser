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
var angle;

function create ()
{
    var graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    var ellipse = new Phaser.Geom.Ellipse(400, 300, 250, 150);

    var circumferencePoint  = new Phaser.Geom.Point(275, 300);
    var centerPoint = new Phaser.Geom.Point(400, 300);

    var line = new Phaser.Geom.Line(400, 300, 275, 300);

    var text1  = this.add.text(20, 50, 'Circumference Point:');
    var text2 = this.add.text(20, 75, 'Angle:')

    this.input.on('pointermove', function (pointer) {

        angle = Phaser.Math.Angle.Between(400, 300, pointer.x, pointer.y);

        circumferencePoint = Phaser.Geom.Ellipse.CircumferencePoint(ellipse, angle);

        line.x2 = circumferencePoint.x;
        line.y2 = circumferencePoint.y;

        text1.setText("Circumference Point: (" + circumferencePoint.x +", " + circumferencePoint.y + ")");
        text2.setText("Angle: " + angle);

        graphics.fillPointShape(circumferencePoint, 20);

        draw();
    });

    draw();

    function draw()
    {
        graphics.clear();
        graphics.lineStyle(2, 0x00aaaa);
        graphics.strokeEllipseShape(ellipse);
        graphics.strokeLineShape(line);
        graphics.fillPointShape(centerPoint, 10);
        graphics.fillPointShape(circumferencePoint, 20);
    }
}
