var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            restingThresh: 1,
            debug: {
                renderFill: false
            },
            gravity: {
                y: 0.05
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
    this.load.image('strip', 'assets/sprites/strip1.png');
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    this.matter.world.setBounds();

    var canCollide = function (filterA, filterB)
    {
        if (filterA.group === filterB.group && filterA.group !== 0)
            return filterA.group > 0;

        return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
    };

    //  Here we'll create Group 1:

    //  This is a colliding group, so objects within this Group will always collide:
    var group1 = this.matter.world.nextGroup();

    var block1 = this.matter.add.image(400, 450, 'strip').setStatic(true).setCollisionGroup(group1);
    var fish1 = this.matter.add.image(100, 100, 'fish', 0).setBounce(1).setFriction(0, 0, 0).setCollisionGroup(group1).setVelocityY(10);

    //  Here we'll create Group 2:
    //  This is a non-colliding group, so objects in this Group never collide:
    var group2 = this.matter.world.nextGroup(true);

    //  block2 won't collide with fish2 because they share the same non-colliding group id
    var block2 = this.matter.add.image(400, 400, 'strip').setStatic(true).setCollisionGroup(group2);
    var fish2 = this.matter.add.image(250, 100, 'fish', 1).setBounce(1).setFriction(0, 0, 0).setCollisionGroup(group2).setVelocityY(10);

    //  however, fish2 WILL collide with block1, as the groups are different and non-zero, so they use the category mask test

    //  by default objects are given a category of 1 and a mask of -1, meaning they will collide (i.e. block1 vs fish2) if in different groups

    //  create a new category (we can have up to 32 of them)
    var cat1 = this.matter.world.nextCategory();

    //  Assign the new category to block3 and fish3 and tell them they should collide:
    var block3 = this.matter.add.image(400, 500, 'strip').setStatic(true).setCollisionCategory(cat1).setCollidesWith(cat1);
    var fish3 = this.matter.add.image(450, 100, 'fish', 2).setBounce(1).setFriction(0, 0, 0).setVelocityY(10).setCollisionCategory(cat1).setCollidesWith(cat1);

    console.log('block1 vs fish1', canCollide(block1.body.collisionFilter, fish1.body.collisionFilter));
    console.log('block1 vs fish2', canCollide(block1.body.collisionFilter, fish2.body.collisionFilter));
    console.log('block1 vs fish3', canCollide(block1.body.collisionFilter, fish3.body.collisionFilter));

    console.log('block2 vs fish1', canCollide(block2.body.collisionFilter, fish1.body.collisionFilter));
    console.log('block2 vs fish2', canCollide(block2.body.collisionFilter, fish2.body.collisionFilter));
    console.log('block2 vs fish3', canCollide(block2.body.collisionFilter, fish3.body.collisionFilter));

    console.log('block3 vs fish1', canCollide(block3.body.collisionFilter, fish1.body.collisionFilter));
    console.log('block3 vs fish2', canCollide(block3.body.collisionFilter, fish2.body.collisionFilter));
    console.log('block3 vs fish3', canCollide(block3.body.collisionFilter, fish3.body.collisionFilter));
}
