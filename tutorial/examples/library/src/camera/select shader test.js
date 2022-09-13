// #module
import HueRotatePostFX from './assets/pipelines/HueRotatePostFX.js';

export default class Example extends Phaser.Scene
{
    constructor()
    {
        super();
    }
    preload()
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }
    create()
    {
        this.image = this.add.image(128, 64, 'einstein');
        const hueRotatePipeline = this.renderer.pipelines.getPostPipeline('HueRotatePostFX');

        let cam = this.cameras.main;
        cam.setSize(256, 128);
        cam.setPostPipeline(hueRotatePipeline);

        let i = 0;
        let b = 0;

        for (let y = 0; y < 4; y++)
        {
            for (let x = 0; x < 4; x++)
            {
                i++;

                if (x === 0 && y === 0)
                {
                    continue;
                }

                if (x === 0)
                {
                    b = (b) ? 0 : 1;
                }

                cam = this.cameras.add(x * 256, y * 128, 256, 128);

                if (b === 0)
                {
                    b = 1;
                }
                else
                {
                    cam.setPostPipeline(hueRotatePipeline)
                    b = 0;
                }
            }
        }
    }

    update()
    {
        this.image.rotation += 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 512,
    scene: [ Example ],
    pipeline: { HueRotatePostFX }
};

const game = new Phaser.Game(config);
