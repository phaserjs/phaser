var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 100,
            debug: true,
            maxVelocity: 500
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
   this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    var image1 = this.add.image(0, -30, 'mushroom');
    var image2 = this.add.image(-40, 30, 'mushroom');
    var image3 = this.add.image(40, 30, 'mushroom');

    var container = this.add.container(400, 200, [ image1, image2, image3 ]);

    //  A Container has a default size of 0x0, so we need to give it a size before enabling a physics
    //  body or it'll be given the default body size of 64x64.
    container.setSize(128, 64);

    this.impact.world.setBounds();

    var body = this.impact.add.body(200, 200).setActiveCollision().setVelocity(300, 150).setBounce(1);

    //  Assign the graphics object to the body. 'false' tells it not to use the Graphics size.
    body.setGameObject(container, true);
}
