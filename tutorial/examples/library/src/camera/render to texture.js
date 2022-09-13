// #module

import PixelatedFX from './assets/pipelines/PixelatedFX.js';

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('volcano', 'assets/pics/the-end-by-iloe-and-made.jpg');
        this.load.image('hotdog', 'assets/sprites/hotdog.png');
    }

    create ()
    {
        const volcano = this.add.image(400, 300, 'volcano');
        const hotdog = this.add.image(400, 300, 'hotdog').setScrollFactor(0);

        this.cameras.main.ignore(hotdog);
        this.cameras.main.setPostPipeline(PixelatedFX);

        const cam1 = this.cameras.add(0, 0, 800, 600);

        cam1.ignore(volcano);

        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: [ Example ],
    pipeline: { PixelatedFX }
};

const game = new Phaser.Game(config);
