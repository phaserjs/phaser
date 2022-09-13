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

    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    var line = new Phaser.Geom.Line(380, 300, 420, 300);

    var length = 40;

    for(var i = 0; i < 30; i++)
    {
        graphics.strokeLineShape(line);

        var normalAngle = Phaser.Geom.Line.NormalAngle(line);

        Phaser.Geom.Line.SetToAngle(line, line.x2, line.y2, normalAngle, length);

        length += 20;
    }

}
