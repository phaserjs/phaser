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

var triangle;
var graphics;
var points;
var index = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 }, fillStyle: { color: 0xff0000 }});

    triangle = new Phaser.Geom.Triangle(400, 100, 100, 500, 700, 500);

    points = [];

    for (var i = 0; i < 25; i++)
    {
        // if we omit a parameter, new Point instance will be created and returned
        points.push(triangle.getRandomPoint());
    }
}

function update ()
{
    index = ++index % 25;

    // we can also supply an instance of Point that will be modified
    triangle.getRandomPoint(points[index]);

    graphics.clear();
    graphics.strokeTriangleShape(triangle);

    for(var i = 0; i < 25; i++)
    {
        var p = points[i];
        graphics.fillCircle(p.x, p.y, 4);
    }
}
