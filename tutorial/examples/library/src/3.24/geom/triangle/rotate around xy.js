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
var graphics;
var triangle;
var rotateX = 350;
var rotateY = 250;
var t = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 }, fillStyle: { color: 0x0000aa } });

    triangle = new Phaser.Geom.Triangle.BuildRight(200, 360, 200, 200);
}

function update ()
{
    graphics.clear();

    t += 0.01;

    Phaser.Geom.Triangle.RotateAroundXY(triangle, rotateX, rotateY, Math.sin(t) * 0.05);

    graphics.strokeTriangleShape(triangle);

    graphics.fillPoint(rotateX, rotateY, 4);
}
