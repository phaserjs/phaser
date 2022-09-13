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
        create: create,
        update: update
    }
};

var blocks;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('clown', 'assets/sprites/clown.png');
}

function create ()
{
    blocks = [];
}

function update ()
{
    this.physics.collide(blocks);

    var p = this.input.activePointer;

    if (p.isDown)
    {
        blocks.push(this.physics.add.image(Phaser.Math.Between(p.x - 100, p.x + 100), p.y, 'clown').setVelocityY(-200).setCollideWorldBounds(true));
    }
}
