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

var block;

new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    block = this.physics.add.image(400, 100, 'block')
        .setVelocity(100, 200)
        .setBounce(1, 1)
        .setCollideWorldBounds(true);

    this.input.setDraggable(block.setInteractive());

    this.input.on('dragstart', function (pointer, obj)
    {
        obj.body.moves = false;
    });

    this.input.on('drag', function (pointer, obj, dragX, dragY)
    {
        obj.setPosition(dragX, dragY);
    });

    this.input.on('dragend', function (pointer, obj)
    {
        obj.body.moves = true;
    });
}
