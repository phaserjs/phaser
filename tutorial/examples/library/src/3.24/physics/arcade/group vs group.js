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

new Phaser.Game(config);

function preload()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
    this.load.image('crate', 'assets/sprites/crate32.png');
}

function create()
{
    //  Create a few balls

    var balls = this.physics.add.group({
        key: 'ball',
        quantity: 24,
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        velocityX: 300,
        velocityY: 150
    });

    //  Create a few crates

    var crates = this.physics.add.group({
        key: 'crate',
        quantity: 24,
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        velocityX: -150,
        velocityY: -300
    });

    Phaser.Actions.RandomRectangle(balls.getChildren(), this.physics.world.bounds);
    Phaser.Actions.RandomRectangle(crates.getChildren(), this.physics.world.bounds);

    this.physics.add.collider(
        balls,
        crates,
        function (ball, crate)
        {
            ball.setAlpha(0.5);
            crate.setAlpha(0.5);
        });
}
