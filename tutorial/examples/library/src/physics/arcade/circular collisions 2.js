var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('ball', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
    this.load.image('wizball', 'assets/sprites/wizball.png');
}

function create ()
{
    this.cameras.main.centerOn(0, 0);

    var wizball = this.physics.add.staticImage(0, 0, 'wizball')
        .setCircle(45);

    var balls = this.physics.add.group({
        bounceX: 1,
        bounceY: 1
    });

    balls.createMultiple({
        quantity: 6,
        key: 'ball',
        frame: [0, 1, 2, 3, 4]
    });

    Phaser.Actions.PlaceOnCircle(balls.getChildren(), { x: 0, y: 0, radius: 300 });

    balls.children.each(function (ball)
    {
        ball.setCircle(8);
        this.physics.moveTo(ball, wizball.x, wizball.y, 100);
    }, this);

    this.physics.add.collider(wizball, balls);
}
