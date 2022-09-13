// #module

import GrayScalePipeline from './assets/pipelines/GrayScale.js';

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
        const grayscalePipeline = this.renderer.pipelines.get('Gray');

        this.add.sprite(100, 300, 'pudding');

        this.add.sprite(400, 300, 'crab').setScale(1.5).setPipeline(grayscalePipeline);

        this.fish = this.add.sprite(400, 300, 'fish').setPipeline(grayscalePipeline);

        this.add.sprite(700, 300, 'cake');

        this.input.on('pointermove', pointer => {

            this.fish.x = pointer.worldX;
            this.fish.y = pointer.worldY;

        });

        this.tweens.add({
            targets: grayscalePipeline,
            delay: 2000,
            repeatDelay: 2000,
            gray: 0,
            yoyo: true,
            repeat: -1
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
    pipeline: { 'Gray': GrayScalePipeline }
};

let game = new Phaser.Game(config);
