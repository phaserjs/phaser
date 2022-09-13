// #module

import BlurPostFX from './assets/pipelines/BlurPostFX.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('volcano', 'assets/pics/bw-face.png');
        this.load.image('hotdog', 'assets/sprites/hotdog.png');
    }

    create ()
    {
        const volcano = this.add.image(400, 300, 'volcano').setAlpha(0.5);
        const hotdog = this.add.image(400, 300, 'hotdog').setScrollFactor(0);

        let cam = this.cameras.main;
        cam.setPostPipeline(BlurPostFX);

        const extracam = this.cameras.add();

        this.cameras.main.ignore(hotdog);
        extracam.ignore(volcano);
    }

    update ()
    {
        // const r = Math.abs(2 * Math.sin(this.time.now * 10));
        // this.blurPipeline.set1f('radius', r);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: Example,
    pipeline: { BlurPostFX }
};

const game = new Phaser.Game(config);
