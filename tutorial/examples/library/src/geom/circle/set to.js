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
    var circle = new Phaser.Geom.Circle(10, 10, 10);

    var graphics = this.add.graphics({ lineStyle: { color: 0x00ff00 } });
    graphics.strokeCircleShape(circle);

    for(var i = 0; i < 38; i++)
    {
        circle.setTo(circle.x + 10, circle.y + 10, circle.radius + 10);
        graphics.strokeCircleShape(circle);
    }
}
