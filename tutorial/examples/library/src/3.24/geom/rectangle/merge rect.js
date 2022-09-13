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

    var baseRect = new Phaser.Geom.Rectangle(350, 250, 100, 100);
    var pointerRect = new Phaser.Geom.Rectangle(0, 0, 25, 25);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Rectangle.CenterOn(pointerRect, pointer.x, pointer.y);

        redraw();

    });

    this.input.on('pointerdown', function (pointer) {

        Phaser.Geom.Rectangle.MergeRect(baseRect, pointerRect);

        redraw();

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.fillRectShape(baseRect);

        graphics.strokeRectShape(pointerRect);
    }
}
