var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var dynamic = null;
var value = 0;

var game = new Phaser.Game(config);

function preload() 
{
    this.load.image('knighthawks', 'assets/fonts/retro/knight3.png');
}

function create() 
{
    var config = {
        image: 'knighthawks',
        width: 31,
        height: 25,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
        charsPerRow: 10,
        spacing: { x: 1, y: 1 }
    };

    this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

    dynamic = this.add.bitmapText(0, 200, 'knighthawks', 'PHASER 3');

    dynamic.setScale(3);
}

function update()
{
    dynamic.text = 'VER ' + value.toFixed(2);
    value += 0.01;
}
