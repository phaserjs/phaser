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

    var point = new Phaser.Geom.Point(250, 0);

    var text = this.add.text(50, 50, '');

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

        // normalized point will always have a magnitude of 1
        Phaser.Geom.Point.Normalize(point);

        text.setText('Normalized point: ' + point.x + '/' + point.y);

        // we can multiply it with desired length to get desired magnitude
        Phaser.Geom.Point.Multiply(point, 200, 200);

        // this will always draw a line that's 200 px long
        graphics.lineBetween(400, 300, 400 + point.x, 300 + point.y);
    }
}
