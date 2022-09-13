var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var ball;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/wizball.png');
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    ball = this.matter.add.image(50, 0, 'ball');

    ball.setCircle();
    ball.setFriction(0.005);
    ball.setBounce(0.6);
    ball.setVelocityX(1);
    ball.setAngularVelocity(0.15);

    var ground = this.matter.add.image(400, 400, 'platform');

    ground.setStatic(true);
    ground.setScale(2, 0.5);
    ground.setAngle(10);
    ground.setFriction(0.005);
}

function update ()
{
    if (ball.y > 600)
    {
        ball.setPosition(50, 0);
        ball.setVelocity(0, 0);
    }
}
