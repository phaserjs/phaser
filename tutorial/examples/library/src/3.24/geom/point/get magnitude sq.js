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
var points;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    point = new Phaser.Geom.Point();

    points = [];

    for(var i = 0; i < 45; i++)
    {
        var x = Math.random() * 800;
        var y = Math.random() * 600;
        points.push(new Phaser.Geom.Point(x, y));
    }
}

function update ()
{
    graphics.clear();

    a += 0.005;

    point.x = 400 - Math.cos(a) * 400;
    point.y = 300 - Math.sin(a * 4) * 300;

    for(var i = 0; i < points.length; i++)
    {
        var temp = Phaser.Geom.Point.Clone(point);

		temp.x -= points[i].x;
		temp.y -= points[i].y;
        var magnitudeSquared = Phaser.Geom.Point.GetMagnitudeSq(temp);

        if(magnitudeSquared < 30 * 30)
        {
            graphics.lineStyle(2, 0xaa0000);
        }
        else
        {
            graphics.lineStyle(2, 0x0000aa);
        }

        graphics.strokeCircle(points[i].x, points[i].y, 30);
    }

    graphics.fillPointShape(point, 5);
}
