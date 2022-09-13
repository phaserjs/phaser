var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
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
    this.load.atlas('soldier', 'assets/animations/soldier.png', 'assets/animations/soldier.json');
    this.load.image('bg', 'assets/pics/town-wreck.jpg');
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var rambo = this.add.sprite(500, 500, 'soldier');

    //  The following animation is created directly on the 'rambo' Sprite.

    //  It cannot be used by any other sprite, and the key ('walk') is never added to
    //  the global Animation Manager, as it's kept local to this Sprite.

    rambo.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('soldier', { prefix: 'soldier_3_walk_', start: 1, end: 8 }),
        frameRate: 12,
        repeat: -1
    });

    //  Now let's create a new 'walk' animation that is stored in the global Animation Manager:

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('soldier', { prefix: 'Soldier_2_walk_', start: 1, end: 8 }),
        frameRate: 12,
        repeat: -1
    });

    //  Because the rambo Sprite has its own 'walk' animation, it will play it:
    rambo.play('walk');

    //  However, this Sprite will play the global 'walk' animation, because it doesn't have its own:
    this.add.sprite(200, 500, 'soldier').play('walk');
}
