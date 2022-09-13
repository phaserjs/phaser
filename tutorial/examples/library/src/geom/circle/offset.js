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
    var circle = new Phaser.Geom.Circle(350, 150, 50);

    var graphics = this.add.graphics({ lineStyle: { color: 0x00ff00 } });
    graphics.strokeCircleShape(circle);

    for(var i = 0; i < 10; i++)
    {
        var angle = i / 10 * Phaser.Math.PI2;

        var xOffset = Math.cos(angle) * circle.diameter;
        var yOffset = Math.sin(angle) * circle.diameter;

        Phaser.Geom.Circle.Offset(circle, xOffset, yOffset);

        graphics.strokeCircleShape(circle);
    }
}
