let total;
let blitter;
let text;
let frames = [];

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('blocks', 'assets/atlas/isoblocks.png', 'assets/atlas/isoblocks.json');
    }

    create ()
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

    update ()
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
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    batchSize: 8000,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
