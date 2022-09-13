var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 300 },
            overlapBias: 8
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
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    // this.physics.world.OVERLAP_BIAS = 8;

    var block = this.physics.add.image(400, 200, 'block');

    block.body.allowGravity = false;
    block.body.immovable = true;
    block.body.moves = false;

    var sprite = this.physics.add.image(400, 100, 'dude');

    this.tweens.add({
        targets: block,
        y: 400,
        duration: 2000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });

    this.physics.add.collider(sprite, block);
}
