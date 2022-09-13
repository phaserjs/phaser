var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 200,
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
    var block = this.impact.add.image(400, 100, 'block');

    block.setActiveCollision().setAvsB().setMaxVelocity(600).setBounce(0.8);

    //  Change the size and position of the physics body in relation to the Image it is bound to
    block.setOffset(16, 16, 64, 64);

    //  Create a floor. We don't need to render it, so just make a Fixed Body
    this.impact.add.body(0, 500, 800, 64).setFixedCollision().setGravity(0);
}
