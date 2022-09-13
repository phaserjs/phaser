class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    }

    create ()
    {
        const text1 = this.add.bitmapText(400, 100, 'desyrel', 'Hello World', 70);

        text1.setOrigin(0.5);
        text1.setScale(1, 1);

        const text2 = this.add.bitmapText(400, 300, 'desyrel', 'Hello World', 70);

        text2.setOrigin(0.5);
        text2.setScale(0.5, 0.5);

        const text3 = this.add.bitmapText(400, 500, 'desyrel', 'Hello World', 70);

        text3.setOrigin(0.5);
        text3.setScale(0.25, 0.25);
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
