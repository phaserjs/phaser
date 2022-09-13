var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var dynamic = null;
var value = 0;

function preload() 
{
    //  Normal font
    this.load.bitmapFont('chiller', 'assets/fonts/bitmap/chiller.png', 'assets/fonts/bitmap/chiller.xml');

    //  Trimmed Atlas version
    this.load.atlas('fontatlas', 'assets/atlas/chiller.png', 'assets/atlas/chiller.json');
    this.load.xml('chillerXML', 'assets/fonts/bitmap/chiller.xml');
}

function create() 
{
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'chiller2', 'fontatlas', 'chiller.png', 'chillerXML');

    this.add.bitmapText(32, 64, 'chiller', '$ Lorem ipsum sit amet');

    //  The texture atlas version
    this.add.bitmapText(32, 64, 'chiller2', '$ Lorem ipsum sit amet');
}
