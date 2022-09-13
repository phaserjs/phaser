class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.path = 'assets/animations/cybercity/';
        this.load.multiatlas('cybercity', 'cybercity-multi.json');
    }

    create ()
    {
        this.anims.create({ key: 'fly', frames: this.anims.generateFrameNames('cybercity', { start: 0, end: 98 }), repeat: -1 });
        this.add.sprite(400, 300).setScale(2.7).play('fly');
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
