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
var polygon;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });

    polygon = new Phaser.Geom.Polygon([
        200, 150,
        400, 300,
        600, 150,
        750, 300,
        600, 450,
        200, 450,
        50, 300
    ]);
}

function update ()
{
    a += 0.015;

    if (a > Math.PI * 4)
    {
        a -= Math.PI * 4;
    }

    var x = 400 - Math.cos(a / 2) * 400;
    var y = 300 - Math.sin(a * 2) * 300;

    graphics.clear();

    graphics.strokePoints(polygon.points, true);

    if(Phaser.Geom.Polygon.Contains(polygon, x, y))
    {
        graphics.fillStyle(0xaa0000);
    }
    else
    {
        graphics.fillStyle(0x0000aa);
    }

    graphics.fillCircle(x, y, 8);
}
