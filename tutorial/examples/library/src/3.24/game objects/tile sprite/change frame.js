var config = {
    type: Phaser.AUTO,
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
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
}

function create ()
{
    var atlasTexture = this.textures.get('atlas');

    var frames = atlasTexture.getFrameNames();

    var startingFrames = ['atari400', 'bunny', 'cokecan', 'copy-that-floppy', 'hotdog'];

    for (var i = 0; i < 5; i++) 
    {
        images[i] = this.add.tileSprite(i * 160, 0, 160, 600, 'atlas', startingFrames[i]).setOrigin(0);
    }

    this.add.text(10, 10, 'Click to change frame', { font: '16px Courier', fill: '#ffffff' });

    this.input.on('pointerdown', function () {

        images[0].setFrame(Phaser.Utils.Array.GetRandom(frames));
        images[1].setFrame(Phaser.Utils.Array.GetRandom(frames));
        images[2].setFrame(Phaser.Utils.Array.GetRandom(frames));
        images[3].setFrame(Phaser.Utils.Array.GetRandom(frames));
        images[4].setFrame(Phaser.Utils.Array.GetRandom(frames));

    }, this);
}

function update ()
{
    var x = 1;

    for (var i = 0; i < 5; i++) 
    {
        images[i].tilePositionX += x;
        images[i].tilePositionY += x / 2;

        x *= -1;
    }

    iter += 0.01;
}