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
        const text = this.add.bitmapText(0, 0, 'ice', 'Phaser 3\nBitmap Text\nOrigin and Scale', 48, 1);

        text.setOrigin(0.5, 0.5);
        text.setPosition(400, 300);
        text.setScale(-2, 2);

        const bounds = text.getTextBounds();

        const debug = this.add.graphics();

        debug.lineStyle(1, 0x00ff00);
        debug.strokeRect(bounds.global.x, bounds.global.y, bounds.global.width, bounds.global.height);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
