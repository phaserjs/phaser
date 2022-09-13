var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var line;
var graphics;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa00aa } });

    line = new Phaser.Geom.Line(250, 300, 550, 300);
}

function update ()
{
    Phaser.Geom.Line.Rotate(line, 0.02);

    graphics.clear();

    graphics.strokeLineShape(line);

    graphics.fillStyle(0xaa0000);
    graphics.fillPointShape(line.getPointA(), 10);

    graphics.fillStyle(0x0000aa);
    graphics.fillPointShape(line.getPointB(), 10);
}
