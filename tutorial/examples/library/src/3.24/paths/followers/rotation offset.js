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
    var curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(100, 100), new Phaser.Math.Vector2(600, 400));

    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0xffffff, 0.5);

    curve.draw(graphics);

    var lemming = this.add.follower(curve, 100, 100, 'lemming');

    lemming.startFollow({
        duration: 5000,
        yoyo: true,
        repeat: -1,
        rotateToPath: true,
        rotationOffset: 90
    });
}
