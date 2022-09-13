var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter'
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
    this.matter.world.setBounds();

    this.matter.add.image(400, 100, 'block', null, { chamfer: 16 }).setBounce(0.9);

    //  These both do the same thing:

    // this.matter.add.pointerConstraint({ length: 1, stiffness: 0.6 });

    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });
}
