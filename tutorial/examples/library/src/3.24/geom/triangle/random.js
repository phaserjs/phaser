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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xffff00 } });

    var triangle = new Phaser.Geom.Triangle.BuildRight(200, 400, 300, 200);

    graphics.strokeTriangleShape(triangle);

    //  Draw random points within it
    for (var i = 0; i < 200; i++)
    {
        var p = Phaser.Geom.Triangle.Random(triangle);

        graphics.fillPointShape(p, 2);
    }
}
