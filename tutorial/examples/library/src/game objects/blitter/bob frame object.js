class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
    }

    create ()
    {
        const blitter = this.add.blitter(100, 200, 'atlas');

        const frameAtari = this.textures.getFrame('atlas', 'atari400');
        const frameBunny = this.textures.getFrame('atlas', 'bunny');
        const frameCokecan = this.textures.getFrame('atlas', 'cokecan');
        const frameFloppy = this.textures.getFrame('atlas', 'copy-that-floppy');
        const frameHotdog = this.textures.getFrame('atlas', 'hotdog');

        blitter.create(0, 0, frameAtari);
        blitter.create(100, 0, frameBunny);
        blitter.create(200, 0, frameCokecan);
        blitter.create(300, 0, frameFloppy);
        blitter.create(400, 0, frameHotdog);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
