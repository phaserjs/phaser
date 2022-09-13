class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.multiatlas('megaset', 'assets/loader-tests/texture-packer-multi-atlas.json', 'assets/loader-tests/');
    }

    create ()
    {
        const blitter = this.add.blitter(0, 0, 'megaset');

        //  Create some bobs, all using different frames from the same atlas texture.
        //  Note that the x/y coordinates are relative to the blitter position.

        const atlasTexture = this.textures.get('megaset');

        const frames = atlasTexture.getFrameNames();

        for (let i = 0; i < frames.length; i++)
        {
            const x = Phaser.Math.Between(0, 1024);
            const y = Phaser.Math.Between(0, 768);

            blitter.create(x, y, frames[i]);
        }
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
