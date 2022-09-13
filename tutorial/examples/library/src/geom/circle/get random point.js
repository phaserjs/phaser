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

var circle;
var graphics;
var points;
var index = 0;

function create ()
{
    circle = new Phaser.Geom.Circle(400, 300, 250);

    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    points = [];

    for (var i = 0; i < 25; i++)
    {
        // if we omit a parameter, new Point instance will be created and returned
        points.push(circle.getRandomPoint());
    }
}

function update ()
{
    index = ++index % 25;

    // we can also supply an instance of Point that will be modified
    circle.getRandomPoint(points[index]);

    graphics.clear();
    graphics.strokeCircleShape(circle);

    for(var i = 0; i < 25; i++)
    {
        var p = points[i];
        graphics.fillRect(p.x - 4, p.y - 4, 8, 8);
    }
}
