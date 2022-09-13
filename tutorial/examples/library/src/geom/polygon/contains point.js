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

    var polygon = new Phaser.Geom.Polygon([
        200, 150,
        400, 300,
        600, 150,
        750, 300,
        600, 450,
        200, 450,
        50, 300
    ]);

    graphics.fillStyle(0x00aa00);
    graphics.fillPoints(polygon.points, true);

    this.input.on('pointermove', function (pointer) {

        graphics.clear();

        if (Phaser.Geom.Polygon.ContainsPoint(polygon, pointer))
        {
            graphics.fillStyle(0xaa0000);
        }
        else
        {
            graphics.fillStyle(0x00aa00);
        }

        graphics.fillPoints(polygon.points, true);

    });
}
