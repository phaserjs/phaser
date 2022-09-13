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
    var line = new Phaser.Geom.Line(330, 150, 430, 170);

    var graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });

    graphics.strokeLineShape(line);

    var angleStep = 1 / 15 * Phaser.Math.PI2;

    for(var i = 0; i < 15; i++)
    {
        var angle = i * angleStep;

        var xOffset = Math.cos(angle) * 50;
        var yOffset = Math.sin(angle) * 50;

        Phaser.Geom.Line.Rotate(line, angleStep);

        Phaser.Geom.Line.Offset(line, xOffset, yOffset);

        graphics.strokeLineShape(line);
    }
}
