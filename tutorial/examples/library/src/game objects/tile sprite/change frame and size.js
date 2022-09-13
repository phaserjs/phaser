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

var ts;
var iter = 1;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
}

function create ()
{
    var atlasTexture = this.textures.get('atlas');

    var frames = atlasTexture.getFrameNames();

    var i = 0;
    var size = 64;

    ts = this.add.tileSprite(400, 300, size, size, 'atlas', 'hotdog');

    this.add.text(10, 10, 'Click to change frame and size', { font: '16px Courier', fill: '#ffffff' });

    this.input.on('pointerdown', function () {

        size += 16;

        ts.setSize(size, size);

        var frame = Phaser.Utils.Array.GetRandom(frames);

        //  Otherwise you can't see it scrolling
        if (frame === 'platform')
        {
            frame = 'hotdog';
        }

        ts.setFrame(frame);

    }, this);
}

function update ()
{
    ts.tilePositionX += iter;
    ts.tilePositionY += iter * 2;
}