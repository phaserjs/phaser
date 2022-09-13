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
    var ellipse = new Phaser.Geom.Ellipse(320, 225, 170, 50);

    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa } });

    graphics.strokeEllipseShape(ellipse);

    for(var i = 0; i < 10; i++)
    {
        var angle = i / 10 * Phaser.Math.PI2;

        var xOffset = Math.cos(angle) * ellipse.width;
        var yOffset = Math.sin(angle) * ellipse.height;

        Phaser.Geom.Ellipse.Offset(ellipse, xOffset, yOffset);

        graphics.strokeEllipseShape(ellipse);
    }
}
