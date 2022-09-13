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
    var graphics = this.add.graphics({ lineStyle: { width:3, color: 0x2266aa } });

    var point = new Phaser.Geom.Point(Math.random() - 0.5, Math.random() - 0.5);

    this.input.on('pointermove', function(pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, point);

        // set relative to center
        Phaser.Geom.Point.Subtract(point, 400, 300);

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        Phaser.Geom.Point.SetMagnitude(point, 250);

        graphics.lineBetween(400, 300, 400 + point.x, 300 + point.y);
    }
}
