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
        const text = this.add.bitmapText(64, 64, 'ice', 'Drop Shadows', 128);

        text.setDropShadow(4, 4, 0x000000);

        const text2 = this.add.bitmapText(64, 264, 'ice', 'Drop Shadows', 128);

        text2.setDropShadow(4, 6, 0xff00ff, 0.7);

        const text3 = this.add.bitmapText(64, 464, 'ice', 'Drop Shadows', 128);

        text3.setDropShadow(0, 8, 0x000000, 0.2);
    }
}

const config = {
    type: Phaser.WEBGL,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
