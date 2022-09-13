// #module

import SwirlSpriteFX from './assets/pipelines/SwirlSpriteFX.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('bg', 'assets/skies/pixelback1.jpg');
     }

    create ()
    {
        const pipeline = this.renderer.pipelines.add('SwirlSpriteFX', new SwirlSpriteFX(this.game));

        this.add.image(400, 300, 'bg');

        const logo = this.add.image(400, 300, 'logo');

        logo.setPipeline(pipeline);
        logo.setFXPadding(128);

        pipeline.x = 0;
        pipeline.strength = 0.75;

        this.tweens.add({
            targets: pipeline,
            x: 1,
            repeat: -1,
            duration: 5000,
            ease: 'Sine.inOut',
            yoyo: true
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
