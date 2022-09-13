var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
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
    this.load.image('knighthawks', 'assets/fonts/retro/knight3.png');
}

function create() 
{
    hsv = Phaser.Display.Color.HSVColorWheel();

    var config = {
        image: 'knighthawks',
        width: 31,
        height: 25,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
        charsPerRow: 10,
        spacing: { x: 1, y: 1 }
    };

    this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

    var text = this.add.dynamicBitmapText(0, 300, 'knighthawks', 'PHASER 3').setScale(4);

    text.setDisplayCallback(textCallback);
}

function textCallback (data)
{
    data.tint.topLeft = hsv[Math.floor(i)].color;
    data.tint.topRight = hsv[359 - Math.floor(i)].color;
    data.tint.bottomLeft = hsv[359 - Math.floor(i)].color;
    data.tint.bottomRight = hsv[Math.floor(i)].color;

    i += 0.1;

    if (i >= hsv.length)
    {
        i = 0;
    }

    return data;
}
