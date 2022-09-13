var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create ()
{
    var text1 = this.add.bitmapText(400, 100, 'desyrel', 'Hello World', 70);

    text1.setOrigin(0.5);
    text1.setScale(1, 1);

    var text2 = this.add.bitmapText(400, 300, 'desyrel', 'Hello World', 70);

    text2.setOrigin(0.5);
    text2.setScale(0.5, 0.5);

    var text3 = this.add.bitmapText(400, 500, 'desyrel', 'Hello World', 70);

    text3.setOrigin(0.5);
    text3.setScale(0.25, 0.25);
}
