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
    this.load.spritesheet('boom', 'assets/sprites/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
}

function create ()
{
    var config = {
        key: 'explode',
        frames: 'boom',
        frameRate: 30,
        repeat: -1,
        repeatDelay: 2000
    };

    this.anims.create(config);

    for (var i = 0; i < 256; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        var boom = this.add.sprite(x, y, 'boom', 23);

        //  Each one can have a random start delay

        boom.play({
            key: 'explode',
            delay: Math.random() * 3000
        });
    }
}
