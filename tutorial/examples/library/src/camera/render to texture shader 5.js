// #module

import ScalinePostFX from './assets/pipelines/ScalinePostFX.js';

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

        // customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline2(game));
        // customPipeline.setFloat2('resolution', game.config.width, game.config.height);
        // customPipeline.setFloat2('mouse', 0.0, 0.0);
    }

    create ()
    {
        this.add.image(400, 300, 'volcano').setAlpha(0.5);
        this.add.image(400, 300, 'hotdog').setScrollFactor(0);

        this.cameras.main.setPostPipeline(ScalinePostFX);

        const shader = this.cameras.main.getPostPipeline(ScalinePostFX);
        this.input.on('pointermove', pointer => {

            shader.mouseX = pointer.x;
            shader.mouseY = pointer.y;

        });

        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
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
    pipeline: { ScalinePostFX }
};

const game = new Phaser.Game(config);
