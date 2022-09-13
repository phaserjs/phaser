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
        //  Create our own EventEmitter instance
        var emitter = new Phaser.Events.EventEmitter();

        //  Set-up an event handler
        emitter.on('addImage', this.handler, this);

        //  Emit it a few times with varying arguments
        emitter.emit('addImage', 200, 300);
        emitter.emit('addImage', 400, 300);
        emitter.emit('addImage', 600, 300);
    }

    handler (x, y)
    {
        this.add.image(x, y, 'plush');
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
