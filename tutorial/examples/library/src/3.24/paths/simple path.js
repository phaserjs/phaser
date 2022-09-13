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

    //  The curves do not have to be joined
    var line1 = new Phaser.Curves.Line([ 100, 100, 500, 200 ]);
    var line2 = new Phaser.Curves.Line([ 200, 300, 600, 500 ]);

    path = this.add.path();

    // path = new Phaser.Curves.Path();

    path.add(line1);
    path.add(line2);

    this.tweens.add({
        targets: follower,
        t: 1,
        ease: 'Linear',
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
    graphics.fillRect(follower.vec.x - 8, follower.vec.y - 8, 16, 16);
}
