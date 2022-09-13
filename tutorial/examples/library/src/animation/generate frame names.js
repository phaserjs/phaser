class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
    }

    create ()
    {
        this.add.text(400, 32, 'Check the source code for comments', { color: '#00ff00' }).setOrigin(0.5, 0);

        //  The gems.json file has the following frames in it:

        //  diamond_0000 to diamond_0015

        //  So we use:

        //  generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 })

        //  Because the prefix is 'diamond_', it has 4 zeros in it (0000), which start at 0000 and end at 0015.

        //  If the frame names had a suffix, i.e. 'diamond_0000.png' then you could do:

        //  generateFrameNames('gems', { prefix: 'diamond_', suffix: '.png', end: 15, zeroPad: 4 })

        this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

        this.add.sprite(400, 200, 'gems').play('diamond');
        this.add.sprite(400, 300, 'gems').play('prism');
        this.add.sprite(400, 400, 'gems').play('ruby');
        this.add.sprite(400, 500, 'gems').play('square');
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    pixelArt: true,
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
