// #module

import BendPipeline from './assets/pipelines/Bend.js';

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setPath('assets/tests/pipeline');

        this.load.image('flower', 'flower.png');
    }

    create ()
    {
        const bendPipeline = this.renderer.pipelines.get('Bend');

        let middle = 400;
        let columns = 8;
        let perRow = 62;
        let scale = 0.1;
        let moveX = (164 * scale);
        let moveY = 32;

        for (let col = 0; col < columns; col++)
        {
            this.add.sprite(middle, moveY, 'flower').setScale(scale).setPipeline(bendPipeline);

            for (let row = 1; row < perRow / 2; row++)
            {
                let x = middle + (row * moveX);

                let flower = this.add.sprite(x, moveY, 'flower').setScale(scale);

                flower.setPipeline(bendPipeline);
            }

            for (let row = 1; row < perRow / 2; row++)
            {
                let x = middle - (row * moveX);

                let flower = this.add.sprite(x, moveY, 'flower').setScale(scale);

                flower.setPipeline(bendPipeline);
            }

            scale += 0.1;
            moveX = (164 * scale);
            moveY += (128 * scale);
            perRow -= 4;
        }

        console.log(this.children);

        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.5,
            drag: 0.01,
            maxSpeed: 1.2
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { 'Bend': BendPipeline }
};

let game = new Phaser.Game(config);
