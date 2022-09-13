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
var projectedPoint;
var angle = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa }, fillStyle: { color: 0xaa0000 } });

    point = new Phaser.Geom.Point(250, 0);
    point2 = new Phaser.Geom.Point(250, 0);

    projectedPoint = Phaser.Geom.Point.Project(point2, point);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, point2);

        point2.x -= 400;
        point2.y -= 300;
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

    Phaser.Geom.Point.Project(point2, point, projectedPoint);

    //move relative to center
    projectedPoint.x += 400;
    projectedPoint.y += 300;

    graphics.fillPointShape(projectedPoint, 15);

    graphics.lineStyle(1, 0xaa0000);
    graphics.lineBetween(point2.x + 400, point2.y + 300, projectedPoint.x, projectedPoint.y);
}
