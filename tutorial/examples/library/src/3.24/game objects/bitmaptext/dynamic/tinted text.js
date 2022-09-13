var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create
    }
};

var i = 0;
var hsv = [];
var game = new Phaser.Game(config);

function preload()
{
    this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
}

function create() 
{
    hsv = Phaser.Display.Color.HSVColorWheel();

    var tintedText = this.add.dynamicBitmapText(32, 64, 'ice', '- Phaser III -', 128);

    tintedText.setDisplayCallback(textCallback);
}

function textCallback (data)
{
    data.tint.topLeft = hsv[Math.floor(i)].color;
    data.tint.topRight = hsv[359 - Math.floor(i)].color;
    data.tint.bottomLeft = hsv[359 - Math.floor(i)].color;
    data.tint.bottomRight = hsv[Math.floor(i)].color;

    i += 0.05;

    if (i >= hsv.length)
    {
        i = 0;
    }

    return data;
}
