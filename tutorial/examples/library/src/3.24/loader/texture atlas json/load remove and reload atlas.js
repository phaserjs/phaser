class SceneA extends Phaser.Scene
{
    constructor ()
    {
        super('SceneA');
    }

    preload ()
    {
        this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
    }

    create ()
    {
        const atlasTexture = this.textures.get('megaset');

        const frames = atlasTexture.getFrameNames();

        for (let i = 0; i < frames.length; i++)
        {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);

            this.add.image(x, y, 'megaset', frames[i]);
        }

        this.input.once('pointerdown', pointer => {

            this.textures.remove('megaset');

            this.scene.start('SceneB');

        });
    }
}

class SceneB extends Phaser.Scene
{
    constructor ()
    {
        super('SceneB');
    }

    preload ()
    {
        this.load.atlas('megaset', 'assets/atlas/megaset-1.png', 'assets/atlas/megaset-1.json');
    }

    create ()
    {
        const atlasTexture = this.textures.get('megaset');

        const frames = atlasTexture.getFrameNames();

        for (let i = 0; i < frames.length; i++)
        {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);

            this.add.image(x, y, 'megaset', frames[i]);
        }

        this.input.once('pointerdown', pointer => {

            this.textures.remove('megaset');

            this.scene.start('SceneA');

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ]
};

const game = new Phaser.Game(config);
