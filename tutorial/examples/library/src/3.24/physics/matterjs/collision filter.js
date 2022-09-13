var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 0
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var blockA = this.matter.add.image(200, 300, 'block').setBounce(1).setFriction(0);
    var blockB = this.matter.add.image(400, 300, 'block');

    var blockC = this.matter.add.image(750, 300, 'block').setStatic(true);
    var blockD = this.matter.add.image(50, 300, 'block').setStatic(true);

    var cat1 = this.matter.world.nextCategory();

    blockA.setCollisionCategory(cat1);
    blockC.setCollisionCategory(cat1);

    var cat2 = this.matter.world.nextCategory();

    blockD.setCollisionCategory(cat2);

    blockA.setCollidesWith([ cat1, cat2 ]);
    // blockA.setCollidesWith(cat1);

    blockA.setVelocityX(25);

    this.matter.world.on('collisionstart', function (event) {

        event.pairs[0].bodyA.gameObject.setTint(0xff0000);
        event.pairs[0].bodyB.gameObject.setTint(0x00ff00);

    });
}
