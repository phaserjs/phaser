var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('neuro', 'assets/pics/neuromancer.jpg');
}

function create ()
{
    //  Here is our event listener, the 'handler' function. The 'this' argument is the context.
    this.events.on('chatsubo', handler, this);

    //  We'll use the Scenes own EventEmitter to dispatch our event

    this.events.emit('chatsubo');
}

function handler ()
{
    this.add.image(400, 300, 'neuro');
}
