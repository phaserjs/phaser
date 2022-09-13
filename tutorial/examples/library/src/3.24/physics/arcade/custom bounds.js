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
    var block1 = this.physics.add.image(400, 250, 'block');

    block1.setVelocity(100, 200);
    block1.setBounce(1, 1);
    block1.setCollideWorldBounds(true);

    var block2 = this.physics.add.image(400, 350, 'block');

    block2.setVelocity(100, 200);
    block2.setBounce(1, 1);
    block2.setCollideWorldBounds(true);
    block2.body.setBoundsRectangle(new Phaser.Geom.Rectangle(200, 150, 400, 300));

    this.add.graphics()
        .lineStyle(5, 0x00ffff, 0.5)
        .strokeRectShape(block1.body.customBoundsRectangle)
        .strokeRectShape(block2.body.customBoundsRectangle);
}
