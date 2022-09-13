class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('plush', 'assets/pics/profil-sad-plush.png');
    }

    create ()
    {
        //  All Game Objects can emit and receive events
        const plush1 = this.add.image(400, 300, 'plush');

        //  If the plush1 object emits the turnRed event, it will change itself to tint red
        plush1.on('turnRed', this.handler);

        //  Emit the event and pass over a reference to itself
        plush1.emit('turnRed', plush1);
    }

    handler (gameObject)
    {
        gameObject.setTint(0xff0000);
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
