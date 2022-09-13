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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    var polygon = new Phaser.Geom.Polygon([
        400, 100,
        200, 278,
        340, 430,
        650, 80
    ]);

    var points = polygon.getPoints(32);

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];

        graphics.fillRect(p.x - 4, p.y - 4, 8, 8);
    }
}
