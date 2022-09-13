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
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000aa } });

    var ellipse = new Phaser.Geom.Ellipse(400, 300, 400, 250);

    var rect = new Phaser.Geom.Rectangle(400, 300, 150, 100);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Rectangle.CenterOn(rect, pointer.x, pointer.y);

        redraw();

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.fillRectShape(rect);

        if(Phaser.Geom.Ellipse.ContainsRect(ellipse, rect))
        {
            graphics.lineStyle(2, 0xaa0000);
        }
        else
        {
            graphics.lineStyle(2, 0x00aaaa);
        }

        graphics.strokeEllipseShape(ellipse, 64);
    }
}
