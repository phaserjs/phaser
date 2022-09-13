class Demo extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.texture(
            {
                "key": "labs",
                "url": {
                    "ASTC": "assets/compressed/labs-astc-4x4.pvr",
                    "ETC1": "assets/compressed/labs-etc1.pvr",
                    "PVRTC": "assets/compressed/labs-pvrtc-4bpp-rgba-srgb.pvr",
                    "S3TC": "assets/compressed/labs-bc3.pvr",
                    "IMG": "assets/compressed/labs.png"
                }
            }
        );
    }

    create ()
    {
        const logo = this.add.image(400, 300, 'labs');

        this.add.text(400, 570, logo.frame.source.compressionAlgorithm).setOrigin(0.5, 0);
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
