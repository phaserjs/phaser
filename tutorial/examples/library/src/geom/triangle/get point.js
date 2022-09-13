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
var triangle;
var point;
var a = 0;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    // triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 200, 300);

    // triangle = new Phaser.Geom.Triangle.BuildRight(200, 400, 300, 200);

    //  Random
    var x1 = Phaser.Math.Between(50, 400);
    var y1 = Phaser.Math.Between(50, 300);

    var x2 = Phaser.Math.Between(450, 750);
    var y2 = Phaser.Math.Between(50, 300);

    var x3 = Phaser.Math.Between(50, 750);
    var y3 = Phaser.Math.Between(350, 550);

    triangle = new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3);

    point = new Phaser.Geom.Rectangle(0, 0, 16, 16);
}

function update ()
{
    a += 0.005;

    if (a > 1)
    {
        a = 0;
    }

    triangle.getPoint(a, point);

    graphics.clear();
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeTriangleShape(triangle);

    graphics.fillStyle(0xff00ff);
    graphics.fillRect(point.x - 8, point.y - 8, point.width, point.height);
}
