var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('lemming', 'assets/sprites/lemming.png');
}

function create ()
{
    var path = new Phaser.Curves.Path(50, 500);

    path.splineTo([ 164, 446, 274, 542, 412, 457, 522, 541, 664, 464 ]);
    path.lineTo(700, 300);
    path.lineTo(600, 350);
    path.ellipseTo(200, 100, 100, 250, false, 0);
    path.cubicBezierTo(222, 119, 308, 107, 208, 368);
    path.ellipseTo(60, 60, 0, 360, true);

    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0xffffff, 1);

    path.draw(graphics, 128);

    var lemming = this.add.follower(path, 50, 500, 'lemming');

    lemming.startFollow({
        duration: 10000,
        yoyo: true,
        repeat: -1,
        rotateToPath: true,
        verticalAdjust: true
    });
}
