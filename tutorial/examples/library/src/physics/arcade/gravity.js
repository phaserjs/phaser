var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 150 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    this.physics.world.gravity.y = 60;

    var group = this.physics.add.group({
        defaultKey: 'block',
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true
    });

    group.create(250, 300);
    group.create(350, 300).setGravity(0, 300);
    group.create(450, 300).setGravity(0, -300);
    group.create(550, 300, 'block').body.setAllowGravity(false);
}
