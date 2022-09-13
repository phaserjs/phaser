let controls;
class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
    }

    create ()
    {
        const sf = 1 / 16;

        for (var i = 0; i < 16; i++)
        {
            this.add.dynamicBitmapText(200, 300, 'ice', 'Phaser 3', 128).setScrollFactor(sf * i);
        }

        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.03,
            drag: 0.0005,
            maxSpeed: 0.5
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }
}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    backgroundColor: '#2d2d2d',
    roundPixels: true,
    scene: [ Example ]
};


const game = new Phaser.Game(config);
