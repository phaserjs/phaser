let value = 0;

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
        this.load.bitmapFont('desyrel-pink', 'assets/fonts/bitmap/desyrel-pink.png', 'assets/fonts/bitmap/desyrel-pink.xml');
        this.load.bitmapFont('shortStack', 'assets/fonts/bitmap/shortStack.png', 'assets/fonts/bitmap/shortStack.xml');
    }

    create ()
    {
        const b = this.add.bitmapText(0, 0, 'desyrel', 16.34);

        this.add.bitmapText(0, 200, 'desyrel-pink', 'Excepteur sint occaecat\ncupidatat non proident');
        this.add.bitmapText(0, 400, 'shortStack', 'Phaser BitmapText');
        this.dynamic = this.add.bitmapText(0, 500, 'desyrel', '');
    }

    update ()
    {
        this.dynamic.text = 'value: ' + value.toFixed(2);
        value += 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
