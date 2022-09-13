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
    path = new Phaser.Curves.Path(100, 100);

    path.lineTo(500, 200);
    path.lineTo(200, 300);
    path.lineTo(400, 500);

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
