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
    graphics = this.add.graphics({ fillStyle: { color: 0x00aa00 }, lineStyle: { color: 0x0000aa } });

    var rectangles = [];
    var points = [];

    for(var x = 0; x < 10; x++)
    {
        for(var y = 0; y < 10; y++)
        {
            var width = Phaser.Math.Between(20, 80);
            var height = Phaser.Math.Between(15, 60);

            var rect = new Phaser.Geom.Rectangle(x * 80, y * 60, width, height);

            rectangles.push(rect);

            points.push(Phaser.Geom.Rectangle.GetCenter(rect));
        }
    }

    redraw();

    this.input.on('pointerdown', function (pointer) {

        recalculate();

        redraw();

    });

    function recalculate()
    {
        for(var i = 0; i < rectangles.length; i++)
        {
            var width = Phaser.Math.Between(20, 80);
            var height = Phaser.Math.Between(15, 60);

            rectangles[i].setSize(width, height);

            Phaser.Geom.Rectangle.GetCenter(rectangles[i], points[i]);
        }
    }

    function redraw()
    {
        graphics.clear();

        graphics.lineStyle(2, 0x0000aa);

        for(var i = 0; i < rectangles.length; i++)
        {
            var rect = rectangles[i];

            graphics.strokeRectShape(rect);

            Phaser.Geom.Rectangle.GetCenter(rect, points[i]);

            graphics.fillPointShape(points[i], 5);
        }

        graphics.lineStyle(1, 0x00aa00);

        graphics.strokePoints(points);
    }
}