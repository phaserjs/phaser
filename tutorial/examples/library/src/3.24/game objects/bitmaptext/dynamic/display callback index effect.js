var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rainbowColor = [0xFF5757, 0xE8A241, 0x97FF7F, 0x52BFFF, 0x995DE8];
var rainbowColorIdx = 0;
var rainbowColorOffset = 0;
var delay = 0;
var rainbowWave = 0;

var jiggleText;
var rainbowText;

var game = new Phaser.Game(config);

function preload() 
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create() 
{
    jiggleText = this.add.dynamicBitmapText(32, 100, 'desyrel', 'It\'s cold outside,\nthere\'s no kind of atmosphere', 64);

    rainbowText = this.add.dynamicBitmapText(32, 400, 'desyrel', 'HELLO WORLD', 96);

    jiggleText.setDisplayCallback(textCallback);

    rainbowText.setDisplayCallback(rainbowCallback);
}

function update()
{
    rainbowColorIdx = 0;

    if (delay++ === 6)
    {
        rainbowColorOffset = (rainbowColorOffset + 1) % (rainbowColor.length);
        delay = 0;
    }
}

function rainbowCallback(data)
{
    data.color = rainbowColor[(rainbowColorOffset + rainbowColorIdx) % rainbowColor.length];
    rainbowColorIdx = (rainbowColorIdx + 1) % (rainbowColor.length);
    data.y = Math.cos(rainbowWave + rainbowColorIdx) * 10;
    rainbowWave += 0.01;

    return data;
}

//  data = { color: color, index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY }
function textCallback (data)
{
    if (data.index >= 5 && data.index <= 8)
    {
        data.x = Phaser.Math.Between(data.x - 2, data.x + 2);
        data.y = Phaser.Math.Between(data.y - 4, data.y + 4);
    }

    return data;
}
