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
        // Initial angular speed of 60 degrees per second.
        // Drag reduces it by 5 degrees/s per second, thus to zero after 12 seconds.
        angularDrag: 5,
        angularVelocity: 60,
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        dragX: 60,
        dragY: 60
    });

    var block1 = group.create(100, 200, 'block').setVelocity(100, 200);
    var block2 = group.create(500, 200, 'block').setVelocity(-100, -100);
    var block3 = group.create(300, 400, 'block').setVelocity(60, 100);
    var block4 = group.create(600, 300, 'block').setVelocity(-30, -50);
}
