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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa }, fillStyle: { color: 0x2266aa } });

    var points = [
        new Phaser.Geom.Point(Math.random() * 300, Math.random() * 200),
        new Phaser.Geom.Point(Math.random() * 400 + 400, Math.random() * 200),
        new Phaser.Geom.Point(Math.random() * 400 + 400, Math.random() * 200 + 200),
        new Phaser.Geom.Point(Math.random() * 400, Math.random() * 300 + 300 ),
        new Phaser.Geom.Point(Math.random() * 400, Math.random() * 300 + 300)
    ];

    this.input.on('pointermove', function(pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, points[0]);

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        graphics.strokePoints(points, true);

        var centroid = Phaser.Geom.Point.GetCentroid(points);

        graphics.fillPointShape(centroid, 20);

        graphics.lineStyle(1, 0x2266aa);

        for(var i = 0; i < points.length; i++)
        {
            graphics.lineBetween(points[i].x, points[i].y, centroid.x, centroid.y);
        }
    }
}
