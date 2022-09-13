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
    var graphics = this.add.graphics({ fillStyle: { color: 0x00aaaa } });

    var ellipses = [];

    for(var x = 0; x < 8; x++)
    {
        for(var y = 0; y < 6; y++)
        {
            var width = Phaser.Math.Between(4, 5) * 20;
            var height = Phaser.Math.Between(4, 5) * 20;

            ellipses.push(new Phaser.Geom.Ellipse(50 + x * 100, 50 + y * 100, width, height));
        }
    }

    var mouseEllipse = new Phaser.Geom.Ellipse(-50, -50, 100, 80);

    this.input.on('pointermove', function (pointer) {

        // round position to (100 * n + 50) pixels
        var x = Math.floor(pointer.x / 100) * 100 + 50;
        var y = Math.floor(pointer.y / 100) * 100 + 50;

        mouseEllipse.setPosition(x, y);

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        var strokeRed = false;

        for(var i = 0; i < ellipses.length; i++)
        {
            graphics.fillEllipseShape(ellipses[i]);
            strokeRed = strokeRed || Phaser.Geom.Ellipse.Equals(mouseEllipse, ellipses[i]);
        }

        if(strokeRed)
        {
            graphics.lineStyle(5, 0xaa0000);
        }
        else
        {
            graphics.lineStyle(5, 0x0000aa);
        }

        graphics.strokeEllipseShape(mouseEllipse);
    }
}
