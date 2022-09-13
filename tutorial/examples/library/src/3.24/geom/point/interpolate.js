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
var point1;
var point2;
var interpolatedPoint;
var t = 0.5;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 3, color: 0x2266aa }, fillStyle: { color: 0x2266aa } });

    point1 = new Phaser.Geom.Point(400, 300);

    point2 = new Phaser.Geom.Point(550, 300);

    interpolatedPoint = Phaser.Geom.Point.Interpolate(point1, point2, t);

    this.input.on('pointermove', function(pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, point2);

    });
}

function update ()
{
    graphics.clear();

    t = (t + 0.01) % 1;

    Phaser.Geom.Point.Interpolate(point1, point2, t, interpolatedPoint);

    graphics.fillPointShape(point1, 20);
    graphics.fillPointShape(point2, 20);

    graphics.fillStyle(0x00aa00);
    graphics.fillPointShape(interpolatedPoint, 20);

    graphics.lineBetween(point1.x, point1.y, point2.x, point2.y);
}
