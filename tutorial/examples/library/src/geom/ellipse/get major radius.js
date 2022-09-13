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
    var graphics = this.add.graphics({ fillStyle: { color: 0x00aaaa }, lineStyle: { width: 2, color: 0xaa0000 } });

    var ellipse = new Phaser.Geom.Ellipse(400, 300, 200, 100);

    this.input.on('pointermove', function (pointer) {

        ellipse.setSize(pointer.x, pointer.y);

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        graphics.fillEllipseShape(ellipse);

        var majorRadius = ellipse.getMajorRadius();

        graphics.strokeCircle(400, 300, majorRadius);
    }
}
