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
    graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });

    pointerLine = new Phaser.Geom.Line(0, 0, 0, 200);

    lines = [];

    for(var i = 0; i < 60; i++)
    {
        lines.push(new Phaser.Geom.Line(0, 0, 0, 0));
    }

    var i = 0;

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Line.CenterOn(pointerLine, pointer.x, pointer.y);

        Phaser.Geom.Line.CopyFrom(pointerLine, lines[i]);

        i = (i + 1) % lines.length;

        graphics.clear();

        graphics.strokeLineShape(pointerLine);

        for(var j = 0; j < lines.length; j++)
        {

            Phaser.Geom.Line.Rotate(lines[j], 0.2);

            graphics.strokeLineShape(lines[j]);

        }
    });
}
