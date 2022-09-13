class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');
    }

    preload ()
    {
        this.load.setPath('assets/loader-tests/');
        this.load.atlas('megaset', [ 'texture-packer-atlas-with-normals-0.png', 'texture-packer-atlas-with-normals-0_n.png' ], 'texture-packer-atlas-with-normals.json');
    }

    create ()
    {
        this.lights.enable();

        this.lights.addLight(300, 300, 300, 0xff0000, 1);
        this.lights.addLight(400, 300, 300, 0x00ff00, 1);
        this.lights.addLight(600, 500, 300, 0x0000ff, 1);

        this.input.on('pointerup', function (pointer) {

            this.scene.start('SceneB');

        }, this);

        let atlasTexture = this.textures.get('megaset');

        let frames = atlasTexture.getFrameNames();

        Phaser.Utils.Array.Shuffle(frames);

        for (let i = 0; i < frames.length; i++)
        {
            let x = Phaser.Math.Between(100, 700);
            let y = Phaser.Math.Between(100, 500);

            this.add.image(x, y, 'megaset', frames[i]).setPipeline('Light2D');
        }

        this.add.image(120, 160, 'megaset', 'contra2');
    }
}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('SceneB');
    }

    create ()
    {
        this.lights.enable();

        let atlasTexture = this.textures.get('megaset');

        let frames = atlasTexture.getFrameNames();

        Phaser.Utils.Array.Shuffle(frames);

        for (let i = 0; i < frames.length; i++)
        {
            let x = Phaser.Math.Between(100, 700);
            let y = Phaser.Math.Between(100, 500);

            this.add.image(x, y, 'megaset', frames[i]).setPipeline('Light2D');
        }

        this.add.image(120, 160, 'megaset', 'contra2');
    }
}

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ]
};

var game = new Phaser.Game(config);
