// #module

import HueRotatePipeline from './assets/pipelines/HueRotateAttribute.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('fish', 'assets/tests/pipeline/fish.png');
    }

    create ()
    {
        const huePipeline = this.renderer.pipelines.get('HueRotatePipeline');

        for (let i = 0; i < 128; i++)
        {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const speed = Phaser.Math.FloatBetween(0.0005, 0.01);

            this.add.image(x, y, 'fish').setScale(0.5).setPipeline(huePipeline, { speed });
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { HueRotatePipeline }
};

let game = new Phaser.Game(config);
