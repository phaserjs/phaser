var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('atari', 'assets/sprites/atari130xe.png');
}

function create ()
{
    var blitter = this.add.blitter(0, 0, 'atari');

    blitter.setAlpha(0.5);

    blitter.create(0, 0);

    blitter.create(200, 50).setAlpha(0.5);

    blitter.create(400, 100);

    blitter.create(600, 150);
}
