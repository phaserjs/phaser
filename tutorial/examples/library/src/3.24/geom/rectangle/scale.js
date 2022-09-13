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
    var rect = new Phaser.Geom.Rectangle(0, 0, 8, 6);

    var graphics = this.add.graphics({ lineStyle: { color: 0x0000aa } });

    redraw(1.2, 1.2);

    this.input.on('pointermove', function(pointer)
    {
        redraw(1.05 + pointer.x / 800, 1.05 + pointer.y / 600);
    });

    function redraw(scaleX, scaleY)
    {
        graphics.clear();

        rect.setTo(0, 0, 8, 6);

        while(rect.width < 800 || rect.height < 600)
        {
            Phaser.Geom.Rectangle.CenterOn(rect, 400, 300);

            graphics.strokeRectShape(rect);

            Phaser.Geom.Rectangle.Scale(rect, scaleX, scaleY);
        }
    }
}
