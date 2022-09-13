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
    var polygon = new Phaser.Geom.Polygon([
        0, 143,
        0, 92,
        110, 40,
        244, 4,
        330, 0,
        458, 12,
        574, 18,
        600, 79,
        594, 153,
        332, 152,
        107, 157
    ]);

    var graphics = this.add.graphics({ x: 100, y: 200 });

    graphics.lineStyle(2, 0x00aa00);

    graphics.beginPath();

    graphics.moveTo(polygon.points[0].x, polygon.points[0].y);

    for (var i = 1; i < polygon.points.length; i++)
    {
        graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
    }

    graphics.closePath();
    graphics.strokePath();
}
