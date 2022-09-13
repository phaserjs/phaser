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

    var rect = new Phaser.Geom.Rectangle(350, 250, 100, 100);

    this.input.on('pointerdown', function (pointer) {

        Phaser.Geom.Rectangle.MergeXY(rect, pointer.x, pointer.y);

        redraw();

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.strokeRectShape(rect);
    }
}
