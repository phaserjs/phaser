var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var startPoint = new Phaser.Math.Vector2(0, 300);
    var controlPoint1 = new Phaser.Math.Vector2(100, 100);
    var controlPoint2 = new Phaser.Math.Vector2(200, 100);
    var endPoint = new Phaser.Math.Vector2(300, 300);

    var curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

    var r = this.add.curve(400, 300, curve, 0x00aa00);

    r.setStrokeStyle(4, 0xff0000);

    // r.setAlpha(0.5);
    // r.setAngle(20);
    // r.setOrigin(1);

    this.input.on('pointermove', function (pointer) {

        r.x = pointer.x;
        r.y = pointer.y;

    });
}