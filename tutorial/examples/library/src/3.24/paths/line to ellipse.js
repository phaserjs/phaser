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

var follower;
var path;
var graphics;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    follower = { t: 0, vec: new Phaser.Math.Vector2() };

    //  Path starts at 100x100
    path = new Phaser.Curves.Path(50, 500);

    path.lineTo(150, 300);

    // xRadius, yRadius, startAngle, endAngle, clockwise, rotation
    path.ellipseTo(200, 100, 100, 300, false, 45);

    path.ellipseTo(200, 100, 100, 300, true);

    path.ellipseTo(60);

    this.tweens.add({
        targets: follower,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 4000,
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();
    graphics.lineStyle(2, 0xffffff, 1);

    path.draw(graphics);

    path.getPoint(follower.t, follower.vec);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(follower.vec.x, follower.vec.y, 12);
}
