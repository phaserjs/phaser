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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa }, fillStyle: { color: 0x00aa00} });

    // we can use either 2 dimensional array, or objects with x/y properties (or mix)
    var points = [
        [350, 250],
        { x: 450, y: 350 }
    ];

    var rect;

    this.input.on('pointerdown', function (pointer) {

        points.push(pointer.position.clone());

        redraw();

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        for(var i = 0; i < points.length; i++)
        {
            var p = points[i];

            if (Array.isArray(p))
            {
                graphics.fillCircle(p[0], p[1], 4);
            }
            else
            {
                graphics.fillCircle(p.x, p.y, 4);
            }
        }

        rect = Phaser.Geom.Rectangle.FromPoints(points, rect);

        graphics.strokeRectShape(rect);
    }
}
