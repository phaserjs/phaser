class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('atari', 'assets/fonts/bitmap/gem.png', 'assets/fonts/bitmap/gem.xml');
    }

    create ()
    {
        const text = this.add.bitmapText(400, 300, 'atari', '', 16)
            .setOrigin(0.5)
            .setCenterAlign()
            .setInteractive();

        text.setText([
            'Phaser 3',
            'BitmapText',
            'Click to change size'
        ]);

        this.input.on('pointerup', function () {

            text.setFontSize(text.fontSize + 2);
            text.setOrigin(0.5);

        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
