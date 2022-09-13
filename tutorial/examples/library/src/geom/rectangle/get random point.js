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

var rect;
var graphics;
var points;
var index = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000ff }, fillStyle: { color: 0xff0000 }});

    rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);

    points = [];

    for (var i = 0; i < 25; i++)
    {
        // if we omit a parameter, new Point instance will be created and returned
        points.push(rect.getRandomPoint());
    }
}

function update ()
{
    index = ++index % 25;

    // we can also supply an instance of Point that will be modified
    rect.getRandomPoint(points[index]);

    graphics.clear();
    graphics.strokeRectShape(rect);

    for(var i = 0; i < 25; i++)
    {
        var p = points[i];
        graphics.fillCircle(p.x, p.y, 4);
    }
}
