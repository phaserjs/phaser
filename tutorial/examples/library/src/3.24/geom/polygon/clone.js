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
var seedPolygon;
var polygons;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });

    seedPolygon = new Phaser.Geom.Polygon([
        new Phaser.Geom.Point(100, 50),
        new Phaser.Geom.Point(150, 100),
        new Phaser.Geom.Point(100, 150),
        new Phaser.Geom.Point(50, 100)
    ]);

    this.input.on('pointermove', function (pointer) {
        seedPolygon.points[1].x = 100 + pointer.x / 4;
        seedPolygon.points[1].y = 50 + pointer.y / 3;
    });

    polygons = [];
}

function update ()
{
    polygons.push(Phaser.Geom.Polygon.Clone(seedPolygon));

    graphics.clear();

    for(var i = 0; i < polygons.length; i++)
    {
        var poly = polygons[i];

        if(poly.points[0].x > 800)
        {
            polygons.splice(i--, 1);
            continue;
        }

        for(var j = 0; j < poly.points.length; j++)
        {
            poly.points[j].x += 8 + j;
            poly.points[j].y += 6 + j;
        }

        graphics.strokePoints(poly.points, true);
    }
}
