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

    var points = [];

    for(var i = 0; i < 100; i++)
    {
        var x = Phaser.Math.Between(1, 40) * 20;
        var y = Phaser.Math.Between(1, 30) * 20;
        points.push(new Phaser.Geom.Point(x, y));
    }

    var pointerPoint = new Phaser.Geom.Point();

    this.input.on('pointermove', function (pointer) {

        // round position to 20 pixels
        var x = Math.round(pointer.x / 20) * 20;
        var y = Math.round(pointer.y / 20) * 20;

        pointerPoint.setTo(x, y);

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        var strokeRed = false;

        for(var i = 0; i < points.length; i++)
        {
            graphics.fillPointShape(points[i], 15);
            strokeRed = strokeRed || Phaser.Geom.Point.Equals(pointerPoint, points[i]);
        }

        if(strokeRed)
        {
            graphics.fillStyle(0xaa0000);
        }
        else
        {
            graphics.fillStyle(0x0000aa);
        }

        graphics.fillPointShape(pointerPoint, 15);
    }
}
