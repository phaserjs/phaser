class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
    }

    create ()
    {
        this.image1 = this.add.image(400, 150, 'atlas', 'atari400');
        this.image2 = this.add.image(400, 400, 'atlas', 'hotdog');

        //  Set the tint like this (topLeft, topRight, bottomLeft, bottomRight)
        this.image1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.image2.setTint(0x0000ff, 0xff0000, 0xff00ff, 0xffff00);
    }

    update ()
    {
        this.image1.rotation -= 0.02;
        this.image2.rotation += 0.02;
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
