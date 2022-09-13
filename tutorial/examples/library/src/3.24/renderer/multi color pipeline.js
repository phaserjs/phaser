// #module

import MultiColorPipeline from './assets/pipelines/MultiColor.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setPath('assets/tests/pipeline/');

        this.load.image('cake', 'cake.png');
        this.load.image('crab', 'crab.png');
        this.load.image('fish', 'fish.png');
        this.load.image('pudding', 'pudding.png');
    }

    create ()
    {
        const multiColorPipeline = this.renderer.pipelines.get('MultiColor');

        const pudding = this.add.sprite(100, 300, 'pudding');
        const crab = this.add.sprite(400, 300, 'crab').setScale(1.5);
        const fish = this.add.sprite(400, 300, 'fish');
        const cake = this.add.sprite(700, 300, 'cake');

        pudding.setPipeline(multiColorPipeline, { effect: 0, gray: 1 });
        crab.setPipeline(multiColorPipeline, { effect: 1, speed: 0.01 });
        fish.setPipeline(multiColorPipeline, { effect: 1, speed: 0.0005 });
        cake.setPipeline(multiColorPipeline, { effect: 0, gray: 0.75 });

        this.input.on('pointermove', pointer => {

            fish.x = pointer.worldX;
            fish.y = pointer.worldY;

        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { 'MultiColor': MultiColorPipeline }
};

let game = new Phaser.Game(config);
