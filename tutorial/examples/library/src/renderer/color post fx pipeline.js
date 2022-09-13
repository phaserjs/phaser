// #module

import BendPostFX from './assets/pipelines/BendPostFX.js';
import ColorPostFX from './assets/pipelines/ColorPostFX.js';
import HueRotate from './assets/pipelines/HueRotate.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setPath('assets/tests/pipeline');

        this.load.image('fish', 'fish.png');
        this.load.image('crab', 'crab.png');
        this.load.image('flower', 'flower.png');
    }

    create ()
    {
        const colorPipeline = this.renderer.pipelines.get('HueRotate');
        const bendPipeline = this.renderer.pipelines.get('BendPostFX');

        this.add.sprite(400, 100, 'fish');

        this.add.sprite(400, 300, 'flower').setPipeline(colorPipeline).setPostPipeline(bendPipeline);

        this.add.sprite(400, 500, 'crab');
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { 'ColorPostFX': ColorPostFX, 'BendPostFX': BendPostFX, 'HueRotate': HueRotate }
};

let game = new Phaser.Game(config);
