var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var container;

var game = new Phaser.Game(config);

function preload ()
{
   this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    var image1 = this.add.image(0, -30, 'mushroom');
    var image2 = this.add.image(-40, 30, 'mushroom');
    var image3 = this.add.image(40, 30, 'mushroom');

    container = this.add.container(400, 200, [ image1, image2, image3 ]);

    //  A Container has a default size of 0x0, so we need to give it a size before enabling a physics
    //  body or it'll be given the default body size of 64x64.
    container.setSize(128, 64);

    this.physics.world.enable(container);

    container.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
}

function update ()
{
    if (container.body.velocity.x < 0)
    {
        container.rotation -= 0.02;
    }
    else
    {
        container.rotation += 0.02;
    }
}
