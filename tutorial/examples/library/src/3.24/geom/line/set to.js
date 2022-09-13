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
    var graphics = this.add.graphics({ lineStyle: { color: 0xaa00aa } });

    var line = new Phaser.Geom.Line(0, 10, 10, 0);

    graphics.strokeLineShape(line);

    for(var i = 0; i < 60; i++)
    {
        line.setTo(line.x1 + 8, line.y1 + 15, line.x2 + 15, line.y2 + 6);

        graphics.strokeLineShape(line);
    }
}
