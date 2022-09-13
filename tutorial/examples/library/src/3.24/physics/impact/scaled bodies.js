var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            maxVelocity: 300,
            debug: true
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
    this.impact.world.setBounds();

    var bigBlock = this.impact.add.image(300, 100, 'block').setActiveCollision().setBounce(1).setVelocity(200, 100);

    //  Scale the Image and the body together
    bigBlock.setBodyScale(2);

    //  You can also scale the image using the normal scale method, but you must sync if after doing so:
    // bigBlock.setScale(2);
    // bigBlock.syncGameObject();

    var smallBlock = this.impact.add.image(100, 500, 'block').setActiveCollision().setBounce(1).setVelocity(200, -100);

    //  Scale the Image and the body together
    smallBlock.setBodyScale(0.5);

    var wideBlock = this.impact.add.image(600, 400, 'block').setActiveCollision().setBounce(1).setVelocity(-200, -100);

    //  Scale the Image and the body together
    wideBlock.setBodyScale(2, 0.5);
}
