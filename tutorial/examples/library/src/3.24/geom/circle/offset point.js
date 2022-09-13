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
    var circle = new Phaser.Geom.Circle(50, 300, 50);

    var graphics = this.add.graphics({ lineStyle: { color: 0x00ff00 } });
    graphics.strokeCircleShape(circle);

    var point = new Phaser.Geom.Point(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));

    Phaser.Geom.Point.Multiply(point, 100, 100);

    for(var i = 0; i < 10; i++)
    {
        Phaser.Geom.Circle.OffsetPoint(circle, point);

        graphics.strokeCircleShape(circle);

        point.y *= -1;
    }
}
