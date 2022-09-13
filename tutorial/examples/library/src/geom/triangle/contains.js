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

var triangle;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 } });

    triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 25, 450);
}

function update ()
{
    a += 0.015;

    if (a > Math.PI * 4)
    {
        a -= Math.PI * 4;
    }

    var x = 400 - Math.cos(a / 2) * 400;
    var y = 300 - Math.sin(a * 2) * 300;

    Phaser.Geom.Triangle.Rotate(triangle, 0.02);

    graphics.clear();

    graphics.strokeTriangleShape(triangle);

    if(Phaser.Geom.Triangle.Contains(triangle, x, y))
    {
        graphics.fillStyle(0xaa0000);
    }
    else
    {
        graphics.fillStyle(0x0000aa);
    }

    graphics.fillCircle(x, y, 8);
}
