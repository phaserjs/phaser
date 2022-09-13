var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 0.3
            },
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
    this.load.image('platform', 'assets/sprites/platform.png');
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    var image1 = this.add.image(0, -30, 'mushroom');
    var image2 = this.add.image(-40, 30, 'mushroom');
    var image3 = this.add.image(40, 30, 'mushroom');

    container = this.add.container(100, 100, [ image1, image2, image3 ]);

    var physicsImage = this.matter.add.gameObject(image1);

    physicsImage.setFrictionAir(0.001);
    physicsImage.setBounce(0.9);

    this.matter.add.image(350, 450, 'platform', null, { isStatic: true }).setScale(2, 0.5).setAngle(10);
}
