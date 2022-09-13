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

var graphics;
var ellipse;
var point;
var a = 0;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    ellipse = new Phaser.Geom.Ellipse(400, 300, 600, 300);
    point = new Phaser.Geom.Rectangle(0, 0, 16, 16);
}

function update ()
{
    a += 0.005;

    if (a > 1)
    {
        a = 0;
    }

    ellipse.getPoint(a, point);

    graphics.clear();
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeEllipseShape(ellipse, 64);

    graphics.fillStyle(0xff00ff);
    graphics.fillRect(point.x - 8, point.y - 8, point.width, point.height);
}
