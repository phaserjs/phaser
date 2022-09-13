var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 }
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
}

function create()
{
    var crates = this.physics.add.group({
        key: 'ball',
        quantity: 24,
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        velocityX: 300,
        velocityY: 150
    });

    Phaser.Actions.RandomRectangle(crates.getChildren(), this.physics.world.bounds);

    this.physics.add.collider(crates);

    // OR

    // this.physics.add.collider(
    //     crates,
    //     undefined,
    //     function (crate1, crate2)
    //     {
    //         crate1.setAlpha(0.5);
    //         crate2.setAlpha(0.5);
    //     }
    // );
}
