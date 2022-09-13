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
    var circle = new Phaser.Geom.Circle(400, 300, 100);

    var graphics = this.add.graphics({ lineStyle: { color: 0xff0000 } });
    graphics.strokeCircleShape(circle);

    graphics.lineStyle(1, 0x00ff00);
    graphics.lineBetween(circle.x, circle.y, circle.x + circle.radius, circle.y);

    graphics.strokeRect(circle.left, circle.top, circle.diameter, circle.diameter);
}
