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
    var graphics = this.add.graphics();

    var rectangles = [];

    for(var x = 0; x < 16; x++)
    {
        for(var y = 0; y < 12; y++)
        {
            var size = Phaser.Math.Between(1, 5) * 10;

            rectangles.push(new Phaser.Geom.Rectangle(x * 50, y * 50, size, size));
        }
    }

    var pointerRect = new Phaser.Geom.Rectangle(0, 0, 50, 50);

    this.input.on('pointermove', function (pointer) {

        // round position to 25 pixels
        var x = Math.round(pointer.x / 25) * 25;
        var y = Math.round(pointer.y / 25) * 25;

        pointerRect.setPosition(x, y);

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();
        graphics.lineStyle(2, 0x0000aa);

        var strokeRed = false;

        for(var i = 0; i < rectangles.length; i++)
        {
            graphics.strokeRectShape(rectangles[i]);
            strokeRed = strokeRed || Phaser.Geom.Rectangle.Equals(pointerRect, rectangles[i]);
        }

        if(strokeRed)
        {
            graphics.lineStyle(5, 0xaa0000);
        }
        else
        {
            graphics.lineStyle(5, 0x0000aa);
        }

        graphics.strokeRectShape(pointerRect);
    }
}
