var config = {
    type: Phaser.CANVAS,
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

    var bob = blitter.create(100, 100);

    console.log(blitter.children);
    console.log(blitter.getRenderList());
}
