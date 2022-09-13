// #module

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
        this.image = this.add.image(128, 256, 'einstein');

        let cam = this.cameras.main;

        //  With shader
        cam.setSize(256, 512);
        cam.setPostPipeline(HueRotatePostFX);

        //  No shader
        cam = this.cameras.add(256, 0, 256, 512);

        //  With shader
        cam = this.cameras.add(512, 0, 256, 512);
        cam.setPostPipeline(HueRotatePostFX);

        //  No shader
        cam = this.cameras.add(768, 0, 256, 512);
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
