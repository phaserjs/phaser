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

    // x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation
    // curve = new Phaser.Curves.Ellipse(400, 300, 100, 260, 0, 180, false);

    //  With minimal arguments it creates a circle of radius 260 centered on 400x300:
    curve = new Phaser.Curves.Ellipse(400, 300, 260);

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Linear',
        duration: 4000,
        repeat: -1
    });

    //  By adjusting the radius you can create a spiral effect

    this.tweens.add({
        targets: curve,
        xRadius: 50,
        yRadius: 200,
        ease: 'Sine.easeInOut',
        duration: 16000,
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(2, 0xffffff, 1);

    curve.draw(graphics, 64);

    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(path.vec.x, path.vec.y, 8);
}
