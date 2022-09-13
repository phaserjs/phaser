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

    var triangle = new Phaser.Geom.Triangle(400, 100, 100, 500, 700, 500);

    graphics.fillStyle(0x00ff00);
    graphics.fillTriangleShape(triangle);

    this.input.on('pointermove', function (pointer) {

        graphics.clear();

        if (Phaser.Geom.Triangle.ContainsPoint(triangle, pointer))
        {
            graphics.fillStyle(0xff0000);
        }
        else
        {
            graphics.fillStyle(0x00ff00);
        }

        graphics.fillTriangleShape(triangle);

    });
}
