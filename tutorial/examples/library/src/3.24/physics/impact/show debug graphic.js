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
    this.add.image(100, 60, 'block').setTint(0xff0000);
    this.add.image(400, 160, 'block').setTint(0xff0000);
    this.add.image(700, 260, 'block').setTint(0xff0000);

    var bodyA = this.impact.add.image(100, 60, 'block');
    var bodyB = this.impact.add.image(400, 160, 'block');
    var bodyC = this.impact.add.image(700, 260, 'block');

    //  Create a floor. We don't need to render it, so just make a Body
    this.impact.add.body(0, 500, 800, 64).setFixedCollision().setGravity(0);

    this.impact.world.setAvsB([ bodyA, bodyB, bodyC ]);
    this.impact.world.setActive([ bodyA, bodyB, bodyC ]);

    bodyA.setMaxVelocity(600).setBounce(0.9);
    bodyB.setMaxVelocity(600).setBounce(0.8);
    bodyC.setMaxVelocity(600).setBounce(0.7);
}
