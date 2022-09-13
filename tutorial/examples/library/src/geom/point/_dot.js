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
var point;
var point2;
var text;

var angle = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa } });

    point = new Phaser.Geom.Point(250, 0);
    point2 = new Phaser.Geom.Point(250, 0);

    text = this.add.text(30, 30, '');

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, point2);

        Phaser.Geom.Point.Subtract(point2, 400, 300);
    });
}

function update ()
{
    graphics.clear();

    angle += 0.005;

    // vector starting at 0/0
    point.setTo(Math.cos(angle) * 250, Math.sin(angle) * 250);

    // drawn from the center (as if center was 0/0)
    graphics.lineBetween(400, 300, 400 + point.x, 300 + point.y);

    graphics.lineStyle(2, 0x00aa00);
    graphics.lineBetween(400, 300, 400 + point2.x, 300 + point2.y);

    var dotProduct = Phaser.Geom.Point.Dot(point, point2);

    var area =
        Phaser.Geom.Point.GetMagnitude(point) *
        Phaser.Geom.Point.GetMagnitude(point2);

    var angleBetween = Math.acos(dotProduct / area);

    // only used to determine arc direction
    var cross = Phaser.Geom.Point.Cross(point, point2);

    graphics.lineStyle(2, 0xaa0000);
    graphics.beginPath();
    graphics.arc(400, 300, 100, angle, angle + (cross < 0 ? -angleBetween : angleBetween));
    graphics.strokePath();

    text.setText([
        'Dot product: ' + dotProduct,
        'Normalized dot product: ' + dotProduct / area,
        'Angle between vectors: ' + Phaser.Math.RadToDeg(angleBetween),
        'Pointer is ' + (dotProduct > 0 ? 'in front of' : 'behind') + ' the blue vector direction'
    ].join('\n'));
}
