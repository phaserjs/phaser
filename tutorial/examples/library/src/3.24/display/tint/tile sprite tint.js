var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var iter = 0;
var tilesprites = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
}

function create ()
{
    var frames = ['atari400', 'bunny', 'cokecan', 'copy-that-floppy', 'hotdog'];

    for (var i = 0; i < frames.length; ++i) 
    {
        tilesprites[i] = this.add.tileSprite(i * 160, 0, 160, 600, 'atlas', frames[i]);
        tilesprites[i].setOrigin(0)
        tilesprites[i].setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    }
}

function update ()
{
    var x = 1;

    for (var i = 0; i < tilesprites.length; ++i) 
    {
        tilesprites[i].tilePositionX += x;
        tilesprites[i].tilePositionY += x;
        x *= -1;
    }

    iter += 0.01;
}
