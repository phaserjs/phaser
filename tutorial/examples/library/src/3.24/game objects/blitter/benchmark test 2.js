var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    batchSize: 8000,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var total;
var blitter;
var text;
var frames = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('blocks', 'assets/atlas/isoblocks.png', 'assets/atlas/isoblocks.json');
}

function create ()
{
    frames = this.textures.get('blocks').getFrameNames();

    total = 230;
    blitter = this.add.blitter(0, 0, 'blocks', 'block-000');
    text = this.add.text(10, 0, 'Total: 230', { font: '16px Courier', fill: '#00ff00' });

    for (var i = 0; i < 230; i++)
    {
        blitter.create(Phaser.Math.Between(0, 1020), Phaser.Math.Between(16, 760), frames[i]);
    }
}

function update ()
{
    if (this.input.activePointer.isDown)
    {
        for (var i = 0; i < 230; i++)
        {
            blitter.create(Phaser.Math.Between(0, 1020), Phaser.Math.Between(16, 760), frames[i]);
        }

        total += 230;

        text.setText('Total: ' + total);
    }
}
