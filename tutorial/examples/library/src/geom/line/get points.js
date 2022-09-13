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
    var graphics = this.add.graphics({ fillStyle: { color: 0xff0000 }});

    var line = new Phaser.Geom.Line(100, 100, 600, 500);

    var points = line.getPoints(32);

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];

        graphics.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
}
