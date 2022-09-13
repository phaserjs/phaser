var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1d1d1d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.05
            },
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
    this.load.image('crate', 'assets/sprites/crate.png');
    this.load.image('crate32', 'assets/sprites/crate32.png');
}

function create ()
{
    this.matter.world.setBounds();

    //  Increase the solver steps from the default to aid with the stack
    this.matter.world.engine.positionIterations = 30;
    this.matter.world.engine.velocityIterations = 30;

    var stack = this.matter.add.imageStack('crate32', null, 300, 50, 5, 18, 30, 0, { _mass: 0.5 });

    this.matter.add.mouseSpring();
}
