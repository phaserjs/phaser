var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var path;
var curve;
var graphics;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    path = { t: 0, vec: new Phaser.Math.Vector2() };

    curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(100, 100), new Phaser.Math.Vector2(600, 400));

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 2000,
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(1, 0xffffff, 1);

    curve.draw(graphics);

    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(path.vec.x, path.vec.y, 16);
}
