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
    var graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xffff00 }});

    var rect = new Phaser.Geom.Rectangle(100, 100, 500, 400);

    graphics.strokeRectShape(rect);

    //  Get 64 points around the rectangle
    // var points = rect.getPoints(64);

    //  Every point will be 50px apart (note the 'false' given for the quantity argument)
    //  If the stepRate doesn't divide equally into the rectangle dimensions then you'll get offset values at the end
    var points = rect.getPoints(false, 50);

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];

        graphics.fillRect(p.x - 4, p.y - 4, 8, 8);
    }
}
