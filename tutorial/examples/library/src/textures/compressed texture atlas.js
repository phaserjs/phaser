class Demo extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        const path = 'assets/compressed';

        this.load.texture('test', {
            'ASTC': { type: 'PVR', textureURL: `${path}/textures-astc-4x4.pvr`, atlasURL: `${path}/textures.json` },
            'PVRTC': { type: 'PVR', textureURL: `${path}/textures-pvrtc-4bpp-rgba.pvr`, atlasURL: `${path}/textures-pvrtc-4bpp-rgba.json` },
            'S3TC': { type: 'PVR', textureURL: `${path}/textures-dxt5.pvr`, atlasURL: `${path}/textures-dxt5.json` },
            'IMG': { textureURL: `${path}/textures.png`, atlasURL: `${path}/textures.json` }
        });
    }

    create ()
    {
        const bubble = this.add.sprite(0, 40, 'test', 'bubble256').setOrigin(0);
        const logo = this.add.sprite(80, 100, 'test', 'logo').setOrigin(0);

        // this.add.text(400, 570, logo.frame.source.compressionAlgorithm).setOrigin(0.5, 0);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d6d',
    scene: Demo
};

const game = new Phaser.Game(config);
