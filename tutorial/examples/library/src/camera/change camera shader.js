// #module

import BendPostFX from './assets/pipelines/BendPostFX.js';
import HueRotatePostFX from './assets/pipelines/HueRotatePostFX.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create ()
    {
        const pic = this.add.image(400, 300, 'einstein');

        this.cameras.main.setPostPipeline(HueRotatePostFX);

        let shader = 1;

        this.input.on('pointerdown', () =>
        {
            shader++;

            if (shader === 0)
            {
                this.cameras.main.resetPostPipeline();
            }
            else if (shader === 1)
            {
                this.cameras.main.resetPostPipeline();
                this.cameras.main.setPostPipeline(HueRotatePostFX);
            }
            else if (shader === 2)
            {
                this.cameras.main.resetPostPipeline();
                this.cameras.main.setPostPipeline(BendPostFX);
            }
            else if (shader === 3)
            {
                this.cameras.main.resetPostPipeline();
                this.cameras.main.setPostPipeline([ BendPostFX, HueRotatePostFX ]);
                shader = -1;
            }

        });

        this.tweens.add({
            targets: pic,
            angle: 360,
            ease: 'Linear',
            duration: 6000,
            repeat: -1
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: Example,
    pipeline: {  BendPostFX, HueRotatePostFX }
};

let game = new Phaser.Game(config);
