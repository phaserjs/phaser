var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    pixelArt: true,
    width: 640,
    height: 480,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var dynamic = null;
var value = 0;
var s = {
    y: -32
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.image('knighthawks', 'assets/fonts/retro/knight3.png');
    this.load.image('1984', 'assets/pics/1984-nocooper-space.png');
    this.load.image('contra', 'assets/pics/contra1.png');
}

function create()
{
    this.add.image(0, 0, '1984').setOrigin(0).setScale(2);

    var config = {
        image: 'knighthawks',
        width: 31,
        height: 25,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
        charsPerRow: 10,
        spacing: { x: 1, y: 1 }
    };

    this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

    dynamic = this.add.dynamicBitmapText(0, 100, 'knighthawks', '             PHASER 3 IS IN THE HOUSE');

    dynamic.setSize(320, 100);
    dynamic.setScale(2);
    dynamic.setDisplayCallback(textCallback);

    this.tweens.add({
        targets: s,
        duration: 500,
        y: 32,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });

    this.add.image(640, 400, 'contra').setOrigin(1).setScale(2);
}

//  data = { index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY, data: Object }
function textCallback (data)
{
    data.y += 32 + s.y * Math.sin(data.index);

    return data;
}


function update (time, delta)
{
    dynamic.scrollX += 0.15 * delta;

    if (dynamic.scrollX > 1300)
    {
        dynamic.scrollX = 0;
    }

}
