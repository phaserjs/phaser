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
    var graphics = this.add.graphics({ lineStyle: { width:2, color: 0x00aaaa } });

    var ellipse = new Phaser.Geom.Ellipse(400, 300, 400, 250);

    graphics.strokeEllipseShape(ellipse);

    this.input.on('pointermove', function (pointer) {

        graphics.clear();

        if(ellipse.contains(pointer.x, pointer.y))
        {
            graphics.lineStyle(2, 0xaa0000);
        }
        else
        {
            graphics.lineStyle(2, 0x00aaaa);
        }

        graphics.strokeEllipseShape(ellipse);

    });
}
