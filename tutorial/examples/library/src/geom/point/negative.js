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

    var point = new Phaser.Geom.Point(450, 350);

    this.input.on('pointermove', function(pointer) {

        point.x = pointer.x - 400;
        point.y = pointer.y - 300;

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        // draw as if 400/300 was the center
        graphics.fillPoint(400 + point.x, 300 + point.y, 15);

        Phaser.Geom.Point.Negative(point, point);

        graphics.fillStyle(0x00aa00);
        graphics.fillPoint(400 + point.x, 300 + point.y, 15);
    }
}
