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
    this.load.image('crate', 'assets/sprites/crate32.png');
}

function create ()
{
    //  Our dynamic TileSprite that will bounce around
    var block = this.add.tileSprite(100, 100, 32 * 4, 32 * 2, 'crate');

    this.physics.add.existing(block, false);

    block.body.setVelocity(130, 180);
    block.body.setBounce(1, 1);
    block.body.setCollideWorldBounds(true);

    //  Our static TileSprite that will just receive collide events
    var staticBlock = this.add.tileSprite(400, 300, 32 * 3, 32 * 8, 'crate');

    this.physics.add.existing(staticBlock, true);

    this.physics.add.collider(block, staticBlock);
}
