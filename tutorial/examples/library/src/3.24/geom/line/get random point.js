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

var line;
var graphics;
var points;
var index = 0;

function create ()
{
    line = new Phaser.Geom.Line(100, 500, 700, 100);

    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff00ff }, fillStyle: { color: 0xff0000 }});

    points = [];

    for (var i = 0; i < 25; i++)
    {
        // if we omit a parameter, new Point instance will be created and returned
        points.push(line.getRandomPoint());
    }
}

function update ()
{
    index = ++index % 25;

    // we can also supply an instance of Point that will be modified
    line.getRandomPoint(points[index]);

    graphics.clear();
    graphics.strokeLineShape(line);

    for(var i = 0; i < 25; i++)
    {
        var p = points[i];
        graphics.fillRect(p.x - 4, p.y - 4, 8, 8);
    }
}
