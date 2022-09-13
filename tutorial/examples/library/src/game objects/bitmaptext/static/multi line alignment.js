class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
        this.load.bitmapFont('atari', 'assets/fonts/bitmap/atari-smooth.png', 'assets/fonts/bitmap/atari-smooth.xml');
    }

    create ()
    {
        const text = this.add.bitmapText(400, 300, 'atari', '', 40).setOrigin(0.5).setRightAlign();

        text.setText([
            'Atari 520 ST',
            'Atari 1040 STE',
            'Atari Falcon 030',
            'Atari Jaguar',
            'Atari Lynx'
        ]);

        // var graphics = this.add.graphics();

        // graphics.fillStyle(0xff0000, 0.5);

        // var bounds = text.getTextBounds();

        // graphics.fillRect(bounds.global.x, bounds.global.y, bounds.global.width, bounds.global.height);

        // graphics.fillRect(0, 0, bounds.lines.lengths[0], 40);
        // graphics.fillRect(0, 41, bounds.lines.lengths[1], 40);
        // graphics.fillRect(0, 82, bounds.lines.lengths[2], 40);
        // graphics.fillRect(0, 123, bounds.lines.lengths[3], 40);
        // graphics.fillRect(0, 164, bounds.lines.lengths[4], 40);
    }

    update ()
    {

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
