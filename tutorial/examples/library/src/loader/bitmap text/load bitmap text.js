var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var value = 0;
var dynamic = null;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    this.load.bitmapFont('desyrel-pink', 'assets/fonts/bitmap/desyrel-pink.png', 'assets/fonts/bitmap/desyrel-pink.xml');
    this.load.bitmapFont('shortStack', 'assets/fonts/bitmap/shortStack.png', 'assets/fonts/bitmap/shortStack.xml');
}

function create ()
{
    this.add.bitmapText(0, 0, 'desyrel', 'Lorem ipsum\ndolor sit amet');
    this.add.bitmapText(0, 200, 'desyrel-pink', 'Excepteur sint occaecat\ncupidatat non proident');
    this.add.bitmapText(0, 400, 'shortStack', 'Phaser BitmapText');

    dynamic = this.add.bitmapText(0, 500, 'desyrel', '');
}

function update ()
{
    dynamic.text = 'value: ' + value.toFixed(2);
    value += 0.01;
}
