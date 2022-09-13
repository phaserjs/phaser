class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.tilesprites = [];
    }

    preload ()
    {
        this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
    }

    create ()
    {
        const frames = ['atari400', 'bunny', 'cokecan', 'copy-that-floppy', 'hotdog'];

        for (let i = 0; i < frames.length; ++i)
        {
            this.tilesprites[i] = this.add.tileSprite(i * 160, 0, 160, 600, 'atlas', frames[i]);
            this.tilesprites[i].setOrigin(0)
            this.tilesprites[i].setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        }
    }

    update ()
    {
        let x = 1;

        for (var i = 0; i < this.tilesprites.length; ++i)
        {
            this.tilesprites[i].tilePositionX += x;
            this.tilesprites[i].tilePositionY += x;
            x *= -1;
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
