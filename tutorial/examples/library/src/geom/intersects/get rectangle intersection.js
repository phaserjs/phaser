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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa } });

    var rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);
    var pointerRect = new Phaser.Geom.Rectangle(450, 350, 150, 100);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Rectangle.CenterOn(pointerRect, pointer.x, pointer.y);

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.strokeRectShape(rect);
        graphics.strokeRectShape(pointerRect);

        var intersection = Phaser.Geom.Intersects.GetRectangleIntersection(rect, pointerRect);

        graphics.lineStyle(2, 0xaa0000);
        graphics.strokeRectShape(intersection);
    }
}
