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

    var frameAtari = this.textures.getFrame('atlas', 'atari400');
    var frameBunny = this.textures.getFrame('atlas', 'bunny');
    var frameCokecan = this.textures.getFrame('atlas', 'cokecan');
    var frameFloppy = this.textures.getFrame('atlas', 'copy-that-floppy');
    var frameHotdog = this.textures.getFrame('atlas', 'hotdog');

    blitter.create(0, 0, frameAtari);
    blitter.create(100, 0, frameBunny);
    blitter.create(200, 0, frameCokecan);
    blitter.create(300, 0, frameFloppy);
    blitter.create(400, 0, frameHotdog);
}
