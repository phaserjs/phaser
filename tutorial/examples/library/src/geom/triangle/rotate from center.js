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
var t = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 } });

    triangle = new Phaser.Geom.Triangle.BuildRight(300, 360, 300, 300);
}

function update ()
{
    graphics.clear();

    t += 0.01;

    Phaser.Geom.Triangle.Rotate(triangle, Math.sin(t) * 0.04);

    graphics.strokeTriangleShape(triangle);
}
