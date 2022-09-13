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
var points;
var angle = 0;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    points = [];

    for(var i = 0; i <= 800 / 5; i++)
    {
        points.push(new Phaser.Geom.Point(i * 5));
    }
}

function update ()
{
    graphics.clear();

    angle += 0.05;

    for(var i = 0; i < points.length; i++)
    {
        if(points[i].x > 0)
        {
            Phaser.Geom.Point.Subtract(points[i], 5, Math.sin(angle + points[i].x / 400 * Math.PI) * 3);
        }
        else
        {
            points[i].setTo(800, Math.sin(angle) * 150 + 300);
        }

        graphics.fillPointShape(points[i], 7);
    }
}
