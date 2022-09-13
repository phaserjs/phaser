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
    var graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    var points = [];

    for(var i = 0; i < 150; i++)
    {
        points.push(new Phaser.Geom.Point());
    }

    var i = 0;

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, points[i]);

        i = (i + 1) % points.length;

        graphics.clear();

        graphics.fillPointShape(pointer, 25);

        for(var j = 0; j < points.length; j++)
        {
            points[j].x += 4 + Math.abs(j - 75) / 15;

            graphics.fillPointShape(points[j], 25);
        }
    });
}
