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

    path = new Phaser.Curves.Path(50, 500);

    path.splineTo([ 164, 446, 274, 542, 412, 457, 522, 541, 664, 464 ]);

    path.lineTo(700, 300);

    path.lineTo(600, 350);

    path.ellipseTo(200, 100, 100, 250, false, 0);

    path.cubicBezierTo(222, 119, 308, 107, 208, 368);

    path.ellipseTo(60, 60, 0, 360, true);

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
