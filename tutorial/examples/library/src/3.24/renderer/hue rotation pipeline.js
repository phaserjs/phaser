// #module

import HueRotatePipeline from './assets/pipelines/HueRotate.js';

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
        const hueRotatePipeline = this.renderer.pipelines.get('HueRotate');

        this.add.sprite(100, 300, 'pudding').setPipeline(hueRotatePipeline);

        this.add.sprite(400, 300, 'crab').setScale(1.5).setPipeline(hueRotatePipeline);

        this.fish = this.add.sprite(400, 300, 'fish').setPipeline(hueRotatePipeline);

        this.add.sprite(700, 300, 'cake').setPipeline(hueRotatePipeline);

        this.input.on('pointermove', pointer => {

            this.fish.x = pointer.worldX;
            this.fish.y = pointer.worldY;

        });

        hueRotatePipeline.speed = 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { 'HueRotate': HueRotatePipeline }
};

let game = new Phaser.Game(config);
