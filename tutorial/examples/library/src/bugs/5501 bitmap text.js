class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
        this.load.bitmapFont('lato', 'assets/fonts/bitmap/lato_0.png', 'assets/fonts/bitmap/lato.xml');
    }

    create ()
    {
        const t1 = this.add.bitmapText(0, 0, 'desyrel', 'The desyrel font');
        const t2 = this.add.bitmapText(0, 100, 'lato', 'The lato font');

        console.log(t1);
        console.log(t2);
    }
}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
