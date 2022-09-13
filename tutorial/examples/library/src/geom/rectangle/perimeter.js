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

    var text = this.add.text(100, 100, '');

    this.input.on('pointermove', function (pointer) {

        rect.width = Phaser.Math.FloorTo((pointer.x - 400) * 2, 1, 25);
        rect.height = Phaser.Math.FloorTo((pointer.y - 300) * 2, 1, 25);

        Phaser.Geom.Rectangle.CenterOn(rect, 400, 300);

        text.setText("Perimeter : " + Phaser.Geom.Rectangle.Perimeter(rect));

        redraw();

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.strokeRectShape(rect);
    }
}
