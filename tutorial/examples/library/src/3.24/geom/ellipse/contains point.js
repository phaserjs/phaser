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

var ellipse;
var point;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa } });

    ellipse = new Phaser.Geom.Ellipse(400, 300, 600, 250);
    point = new Phaser.Geom.Rectangle(0, 0, 16, 16);
}

function update ()
{
    a += 0.015;

    if (a > Math.PI * 4)
    {
        a -= Math.PI * 4;
    }

    point.x = 400 - Math.cos(a / 2) * 400;
    point.y = 300 - Math.sin(a * 2) * 300;

    graphics.clear();

    graphics.strokeEllipseShape(ellipse);

    if(Phaser.Geom.Ellipse.ContainsPoint(ellipse, point))
    {
        graphics.fillStyle(0xaa0000);
    }
    else
    {
        graphics.fillStyle(0x0000aa);
    }

    graphics.fillRect(point.x - 8, point.y - 8, point.width, point.height);
}
