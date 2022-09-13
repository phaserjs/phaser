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

    frames.splice(frames.indexOf('platform'), 1);

    ts = this.add.tileSprite(0, 0, 800, 600, '__MISSING').setOrigin(0);

    this.add.text(10, 10, 'Click to change frame', { font: '16px Courier', fill: '#ffffff' });

    this.input.on('pointerdown', function () {
        ts.setTexture('atlas', Phaser.Utils.Array.GetRandom(frames));
    });
}

function update ()
{
    var x = 1;

    ts.tilePositionX += x;
    ts.tilePositionY += x / 2;

    iter += 0.01;
}
