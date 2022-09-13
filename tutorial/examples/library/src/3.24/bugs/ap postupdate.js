var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() 
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create() 
{
    this.add.bitmapText(0, 0, 'desyrel', 'static bitmap text');
    this.add.dynamicBitmapText(0, 100, 'desyrel', 'dynamic bitmap text');

    this.cameras.main.setScroll(-50, -50);
}