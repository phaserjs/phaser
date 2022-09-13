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
var step = 0.5;
var points;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x2266aa } });

    points = [];
}

function update ()
{
    if(step <= Math.PI / 50)
    {
        return;
    }
    else
    {
        step = Math.max(step * 0.998, Math.PI / 50);
    }

    graphics.clear();

    var i = 0;

    for(var angle = 0; angle < Math.PI * 2; angle += step)
    {
        var point = points[i] || new Phaser.Geom.Point();

        point.setTo(Math.cos(angle) * 290, Math.sin(angle) * 290)

        points[i] = point;

        ++i;
        points[i] = Phaser.Geom.Point.Negative(point, points[i]);

        ++i;
    }

    for(var j = 0; j < points.length; j++)
    {
        points[j].x += 400;
        points[j].y += 300;
    }

    graphics.strokePoints(points, false);
}
