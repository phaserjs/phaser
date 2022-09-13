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
        const dynamic1 = this.add.bitmapText(0, 0, 'desyrel', 'welcome to the jungle\nwe got fun and games');
    }
}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
