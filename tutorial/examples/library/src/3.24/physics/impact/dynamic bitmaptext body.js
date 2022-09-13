var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 100,
            maxVelocity: 500
        }
    },
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

var game = new Phaser.Game(config);

function preload()
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    this.load.bitmapFont('hyper', 'assets/fonts/bitmap/hyperdrive.png', 'assets/fonts/bitmap/hyperdrive.xml');
}

function create ()
{
    //  Calling this with no arguments will set the bounds to match the game config width/height
    this.impact.world.setBounds();

    //  Create a Bitmap Text object
    var text1 = this.add.dynamicBitmapText(0, 0, 'desyrel', 'It\'s cold\noutside', 64);
    var text2 = this.add.dynamicBitmapText(0, 0, 'hyper', 'PHASER', 128);

    text1.setDisplayCallback(textCallback);
    text2.setDisplayCallback(rainbowCallback);

    //  If you don't set the body as active it won't collide with the world bounds
    //  Set the Game Object we just created as being bound to this physics body
    this.impact.add.body(200, 100).setGameObject(text1).setLiteCollision().setVelocity(-300, 200).setBounce(1);
    this.impact.add.body(100, 300).setGameObject(text2).setLiteCollision().setVelocity(300, 200).setBounce(1);
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

function rainbowCallback (data)
{
    data.color = rainbowColor[(rainbowColorOffset + rainbowColorIdx) % rainbowColor.length];
    rainbowColorIdx = (rainbowColorIdx + 1) % (rainbowColor.length);
    data.y = Math.cos(rainbowWave + rainbowColorIdx) * 10;
    rainbowWave += 0.01;

    return data;
}

function textCallback (data)
{
    if (data.index >= 5 && data.index <= 8)
    {
        data.x = Phaser.Math.Between(data.x - 2, data.x + 2);
        data.y = Phaser.Math.Between(data.y - 4, data.y + 4);
    }

    return data;
}
