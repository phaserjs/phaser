var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 100 }
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
    this.load.image('wizball', 'assets/sprites/wizball.png');
}

function create ()
{
    var ball1 = this.physics.add.image(100, 240, 'wizball');
    var ball2 = this.physics.add.image(700, 240, 'wizball');

    ball1.setCircle(46);
    ball2.setCircle(46);

    ball1.setCollideWorldBounds(true);
    ball2.setCollideWorldBounds(true);

    ball1.setBounce(1);
    ball2.setBounce(1);

    ball1.setVelocity(150);
    ball2.setVelocity(-200, 60);

    this.physics.add.collider(ball1, ball2);
}
