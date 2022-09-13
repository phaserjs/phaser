class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('turkey', 'assets/pics/turkey-1985086.jpg');
        this.load.image('face', 'assets/pics/bw-face.png');
    }

    create ()
    {
        const face = this.add.image(400, 300, 'face');
        const sea = this.add.image(400, 300, 'turkey');

        //  top left, top right, bottom left, bottom right
        sea.setAlpha(1, 1, 0, 0);
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
