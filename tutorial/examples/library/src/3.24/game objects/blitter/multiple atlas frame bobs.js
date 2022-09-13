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
    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
}

function create ()
{
    var blitter = this.add.blitter(100, 200, 'atlas');

    //  Create some bobs, all using different frames from the same atlas texture.
    //  Note that the x/y coordinates are relative to the blitter position.

    blitter.create(0, 0, 'atari400');
    blitter.create(100, 0, 'bunny').setFlipX();
    blitter.create(200, 0, 'cokecan');
    blitter.create(300, 0, 'copy-that-floppy');
    blitter.create(400, 0, 'hotdog');
}
