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
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    var startPoint = new Phaser.Math.Vector2(50, 260);
    var controlPoint1 = new Phaser.Math.Vector2(610, 25);
    var controlPoint2 = new Phaser.Math.Vector2(320, 370);
    var endPoint = new Phaser.Math.Vector2(735, 550);

    var curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0xffffff, 1);

    curve.draw(graphics, 64);

    var ball = this.add.follower(curve, 50, 260, 'ball');

    ball.startFollow({
        duration: 3000,
        yoyo: true,
        ease: 'Sine.easeInOut'
    });
}
