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

    var graphics = this.add.graphics();

    graphics.lineStyle(3, 0xaa0000);
    graphics.strokeLineShape(triangle.getLineA());

    graphics.lineStyle(3, 0x00aa00);
    graphics.strokeLineShape(triangle.getLineB());

    graphics.lineStyle(3, 0x0000aa);
    graphics.strokeLineShape(triangle.getLineC());
}
