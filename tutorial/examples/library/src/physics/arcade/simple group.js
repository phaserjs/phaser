var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
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
    var group = this.physics.add.group({
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true
    });

    var block1 = group.create(100, 200, 'block').setVelocity(100, 200);
    var block2 = group.create(500, 200, 'block').setVelocity(-100, -100);
    var block3 = group.create(300, 400, 'block').setVelocity(60, 100);
    var block4 = group.create(600, 300, 'block').setVelocity(-30, -50);

    this.physics.add.collider(group, group);
}
