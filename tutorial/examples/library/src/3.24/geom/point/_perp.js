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

    var graphics = this.add.graphics({ lineStyle: { width: 3, color: 0x2266aa } });

    var point = new Phaser.Geom.Point(250, -150);

    this.input.on('pointermove', function (pointer) {

        //set relative to center
        point.x = pointer.x - 400;
        point.y = pointer.y - 300;

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.lineBetween(400, 300, 400 + point.x, 300 + point.y);

        // rotates the point around 0/0 at 90 degrees towards right
        // the result is a vector perpendicular to the original vector
        Phaser.Geom.Point.Perp(point);

        graphics.lineStyle(2, 0x00aa00);
        graphics.lineBetween(400, 300, 400 + point.x, 300 + point.y);
    }
}
