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
    var graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    var point = new Phaser.Geom.Point(400, 100);

    this.input.on('pointermove', function(pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, point);

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.fillPointShape(point, 15);

        Phaser.Geom.Point.Invert(point);

        graphics.fillStyle(0x00aa00);
        graphics.fillPointShape(point, 15);
    }
}
