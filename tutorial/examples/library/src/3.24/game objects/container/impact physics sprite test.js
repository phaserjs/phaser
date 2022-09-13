var config = {
    type: Phaser.AUTO,
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
    var bodyA = this.impact.add.image(100, 60, 'block');
    var bodyB = this.impact.add.image(400, 160, 'block');
    var bodyC = this.impact.add.image(700, 260, 'block');

    var container = this.add.container(100, 0, [ bodyA, bodyB, bodyC ]);

    //  Create a floor using setBounds
    //  x, y, width, height, left, right, top, bottom (true = our floor)
    this.impact.world.setBounds(0, 0, 800, 600, false, false, false, true);

    this.impact.world.setAvsB([ bodyA, bodyB, bodyC ]);
    this.impact.world.setActive([ bodyA, bodyB, bodyC ]);

    bodyA.setMaxVelocity(600).setBounce(0.9);
    bodyB.setMaxVelocity(600).setBounce(0.8);
    bodyC.setMaxVelocity(600).setBounce(0.7);
}
