var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    pixelArt: true,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('zombie', 'assets/tests/zombie-no-pivot.png', 'assets/tests/zombie-no-pivot.json');
}

function create ()
{
    //  Here we just pass the texture atlas key to `create` and it will extract all frames
    //  from within it, numerically sorting them for the animation.

    this.anims.create({
        key: 'walk',
        frames: 'zombie',
        frameRate: 12,
        repeat: -1
    });

    this.add.sprite(400, 300).play('walk');
}
