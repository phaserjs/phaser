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
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa } });

    pointerEllipse = new Phaser.Geom.Ellipse(400, 300, 400, 300);

    ellipses = [];

    for(var i = 0; i < 30; i++)
    {
        ellipses.push(new Phaser.Geom.Ellipse(0, 0, 0, 0));
    }

    var i = 0;

    this.input.on('pointermove', function (pointer) {

        pointerEllipse.setTo(pointer.x, pointer.y, pointer.x / 8, pointer.y / 6);

        Phaser.Geom.Ellipse.CopyFrom(pointerEllipse, ellipses[i]);

        i = (i + 1) % ellipses.length;

        graphics.clear();

        graphics.strokeEllipseShape(pointerEllipse);

        for(var j = 0; j < ellipses.length; j++)
        {

            ellipses[j].width *= 1.1;
            ellipses[j].height *= 1.1;

            graphics.strokeEllipseShape(ellipses[j]);

        }

    });
}