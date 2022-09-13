// #module
import BendWavesPostFX from './assets/pipelines/BendWavesPostFX.js';

export default class Example extends Phaser.Scene
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

        this.cameras.main.setPostPipeline(BendWavesPostFX);

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
    pipeline: { BendWavesPostFX }
};

const game = new Phaser.Game(config);
