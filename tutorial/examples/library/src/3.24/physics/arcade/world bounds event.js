var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            }
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
    this.load.image('bg', 'assets/skies/space2.png');
    this.load.spritesheet('ball', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var group = this.physics.add.group({
        key: 'ball',
        frameQuantity: 48,
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        velocityX: 180,
        velocityY: 120,
    });

    Phaser.Actions.RandomRectangle(group.getChildren(), this.cameras.main);

    Phaser.Actions.Call(group.getChildren(), function (ball) {
        ball.body.onWorldBounds = true;
    });

    this.physics.world.on('worldbounds', onWorldBounds);
}

function onWorldBounds (body)
{
    var ball = body.gameObject;
    var frame = ball.frame.name;
    
    frame += 1;
    frame %= 5;

    ball.setFrame(frame);
}
