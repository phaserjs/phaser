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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa } });

    var point = new Phaser.Geom.Point(400, 275);
    var points = [];

    var angle = 0;
    var length = 1;

    while(point.y < 600)
    {
        length += 0.05 / length;
        angle += 0.05;

        point = Phaser.Geom.Point.Clone(point);

        point.x += Math.cos(angle) * length;
        point.y += Math.sin(angle) * length;

        points.push(point);
    }

    graphics.strokePoints(points);
}
