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
    var graphics = this.add.graphics({ lineStyle: { width: 5, color: 0xaa00aa } });

    var lines = [];

    for(var x = 0; x < 8; x++)
    {
        for(var y = 0; y < 6; y++)
        {
            var line = new Phaser.Geom.Line(x * 100 + 10, y * 100 + 50, x * 100 + 90, y * 100 + 50);

            Phaser.Geom.Line.Rotate(line, Phaser.Math.Between(0, 3) * (Math.PI / 4));

            lines.push(line);
        }
    }

    var mouseLine = new Phaser.Geom.Line(-80, 0, 0, 0);

    this.input.on('pointermove', function (pointer) {

        // round position to (100 * n + 50) pixels
        var x = Math.floor(pointer.x / 100) * 100 + 50;
        var y = Math.floor(pointer.y / 100) * 100 + 50;

        Phaser.Geom.Line.CenterOn(mouseLine, x, y);

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        var strokeRed = false;

        for(var i = 0; i < lines.length; i++)
        {
            graphics.strokeLineShape(lines[i]);
            strokeRed = strokeRed || Phaser.Geom.Line.Equals(mouseLine, lines[i]);
        }

        if(strokeRed)
        {
            graphics.lineStyle(5, 0xaa0000);
        }
        else
        {
            graphics.lineStyle(5, 0xaa00aa);
        }

        graphics.strokeLineShape(mouseLine);
    }
}
