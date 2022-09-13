// #module
import BendRotationWavesPostFX from './assets/pipelines/BendRotationWavesPostFX.js';

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('volcano', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
        this.load.image('hotdog', 'assets/sprites/hotdog.png');
    }

    create ()
    {
        this.add.image(400, 300, 'volcano');
        this.add.image(400, 300, 'hotdog').setScrollFactor(0);

        this.cameras.main.setPostPipeline(BendRotationWavesPostFX);

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

    update (t, delta)
    {
        this.controls.update(delta);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 512,
    height: 512,
    backgroundColor: '#000000',
    scene: [ Example ],
    pipeline: { BendRotationWavesPostFX }
};

const game = new Phaser.Game(config);
