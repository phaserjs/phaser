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

var images = [];
var game = new Phaser.Game(config);
var iter = 0;

function preload ()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
}

function create ()
{
    var frames = ['atari400', 'bunny', 'cokecan', 'copy-that-floppy', 'hotdog'];
    for (var i = 0; i < frames.length; ++i) 
    {
        images[i] = this.add.tileSprite(i * 160, 0, 160, 600, 'atlas', frames[i]);
        images[i].originX = 0;
        images[i].originY = 0;
    }
}

function update ()
{
    var x = 1;
    for (var i = 0; i < images.length; ++i) 
    {
        images[i].tilePositionX += x;
        x *= -1;
    }
    iter += 0.01;
}