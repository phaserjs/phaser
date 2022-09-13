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
    var line = new Phaser.Geom.Line(100, 500, 700, 100);

    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    graphics.strokeLineShape(line);
}
