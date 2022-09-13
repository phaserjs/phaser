var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
    width: 640 * 2,
    height: 400 * 2,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var scrollers;
var dynamic;

var game = new Phaser.Game(config);

function preload() 
{
    this.load.image('171', 'assets/fonts/retro/171.png');
    this.load.image('rain', 'assets/pics/shadow-of-the-beast2-karamoon.png');
    this.load.image('contra', 'assets/pics/contra2.png');
}

function create() 
{
    this.add.image(0, 0, 'rain').setOrigin(0).setScale(2);

    var config = {
        image: '171',
        width: 16,
        height: 18,
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ| 0123456789*#!@:.,\\?-+=^$£()\'',
        charsPerRow: 19,
        spacing: { x: 0, y: 1 }
    };

    this.cache.bitmapFont.add('171', Phaser.GameObjects.RetroFont.Parse(this, config));

    scrollers = this.add.group();

    for (var i = 0; i < 20; i++)
    {
        var t = this.add.dynamicBitmapText(0, i * 40, '171', '                                 PHASER 3 IS IN THE HOUSE ... WELCOME TO THIS BITMAP TEXT SCROLLER DEMO, SHOWING OFF A NICE NEW FEATURE!!! AND WRAPP........'); 

        t.setSize(640, 18);

        t.setScale(2);

        scrollers.add(t);
    }

    this.add.image(640, 800, 'contra').setOrigin(0.5, 1).setScale(2);
}

function update (time, delta)
{
    scrollers.children.iterate(function (child, index) {

        child.scrollX += 2.5 + Math.sin((0.01 * index) * delta);

        if (child.scrollX > 2800)
        {
            child.scrollX = -200;
        }

    });
}
