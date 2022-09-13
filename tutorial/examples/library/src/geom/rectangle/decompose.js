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
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000aa }, lineStyle: { color: 0x0000aa } });

    var points = [];
    var rect = new Phaser.Geom.Rectangle(0, 0, 200, 150);

    this.input.on('pointerdown', function () {
        Phaser.Geom.Rectangle.Decompose(rect, points);
        redraw();
    });

    this.input.on('pointermove', function (pointer) {
        Phaser.Geom.Rectangle.CenterOn(rect, pointer.x, pointer.y);
        redraw();
    });

    function redraw ()
    {
        graphics.clear();

        graphics.strokeRectShape(rect);

        for(var i = 0; i < points.length; i++)
        {
            graphics.fillCircle(points[i].x, points[i].y, 5);
        }
    }
}
