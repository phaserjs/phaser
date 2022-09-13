class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    }

    create ()
    {
        const image = this.add.image(400, 300, 'face');

        image.setAlpha(0.2);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#7d2d2d',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
