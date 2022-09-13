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
    var triangle = new Phaser.Geom.Triangle(400, 250, 300, 350, 500, 350);

    var graphics = this.add.graphics({ lineStyle: { color: 0xaaaa00 } });

    graphics.strokeTriangleShape(triangle);

    for(var i = 0; i < 25; i++)
    {
        triangle.setTo(
            triangle.x1 * 0.97, triangle.y1 * 0.95,
            triangle.x2 * 1.05, triangle.y2 * 1.04,
            triangle.x3 * 1.02, triangle.y3 * 1.01,
        );

        graphics.strokeTriangleShape(triangle);
    }
}
