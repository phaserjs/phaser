class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('neuro', 'assets/pics/neuromancer.jpg');
    }

    create ()
    {
        //  Here is our event listener, the 'handler' function. The 'this' argument is the context.
        this.events.on('chatsubo', this.handler, this);

        //  We'll use the Scenes own EventEmitter to dispatch our event
        this.events.emit('chatsubo');
    }

    handler ()
    {
        this.add.image(400, 300, 'neuro');
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
