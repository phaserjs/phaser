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
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    this.matter.world.setBounds();

    //  Add a few blocks, you can drag all of these with the pointer

    var canDrag = this.matter.world.nextGroup();

    this.matter.add.image(100, 100, 'block', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(canDrag);
    this.matter.add.image(300, 100, 'block', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(canDrag);
    this.matter.add.image(600, 100, 'block', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(canDrag);

    //  Add some mushrooms, you cannot drag these

    var noDrag = this.matter.world.nextGroup();

    this.matter.add.image(200, 100, 'mushroom', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(noDrag);
    this.matter.add.image(400, 100, 'mushroom', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(noDrag);
    this.matter.add.image(500, 100, 'mushroom', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(noDrag);

    //  Our constraint

    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, collisionFilter: { group: canDrag } });
}
