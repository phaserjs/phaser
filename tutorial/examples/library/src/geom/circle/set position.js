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
    var circle = new Phaser.Geom.Circle(0, 0, 75);

    circle.setPosition(400, 200);

    var graphics = this.add.graphics({ lineStyle: { color: 0xff0000 } });
    graphics.strokeCircleShape(circle);

    // move right by radius
    circle.x += circle.radius;

    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeCircleShape(circle);

    // place top-right corner to bottom-left of its previous position
    circle.right = circle.left;
    circle.top = circle.bottom;

    graphics.lineStyle(1, 0x0000ff);
    graphics.strokeCircleShape(circle);
}
