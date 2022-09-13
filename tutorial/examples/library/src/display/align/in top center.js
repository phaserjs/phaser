class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic', 'assets/pics/barbarian-loading.png');
        this.load.image('block', 'assets/sprites/block.png');
    }

    create ()
    {
        const pic = this.add.image(0, 0, 'pic');
        const block = this.add.image(0, 0, 'block');

        //  Center the picture in the game
        Phaser.Display.Align.In.Center(pic, this.add.zone(400, 300, 800, 600));

        //  Center the sprite to the picture
        Phaser.Display.Align.In.TopCenter(block, pic);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
