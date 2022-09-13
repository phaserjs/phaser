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

    var points = [];

    var rect = new Phaser.Geom.Rectangle(350, 250, 100, 100);

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

            graphics.fillCircle(p.x, p.y, 4);
        }

        Phaser.Geom.Rectangle.MergePoints(rect, points);

        graphics.strokeRectShape(rect);
    }
}
