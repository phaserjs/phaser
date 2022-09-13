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
    var graphics = this.add.graphics();

    var triangle = new Phaser.Geom.Triangle.BuildEquilateral(200, 200, 200);

    graphics.lineStyle(2, 0x00aa00);

    graphics.strokeTriangleShape(triangle);

    for (var i = 0; i < 6; i++)
    {
        triangle.left += 64;

        graphics.strokeTriangleShape(triangle);
    }

    graphics.lineStyle(2, 0x00ff00);

    graphics.strokeTriangleShape(triangle);
}
