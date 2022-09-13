var config = {
    type: Phaser.WEBGL,
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
    this.load.image('plush', 'assets/pics/profil-sad-plush.png');
}

function create ()
{
    //  All Game Objects can emit and receive events
    var plush1 = this.add.image(400, 300, 'plush');

    //  If the plush1 object emits the turnRed event, it will change itself to tint red
    plush1.on('turnRed', handler);

    //  Emit the event and pass over a reference to itself
    plush1.emit('turnRed', plush1);
}

function handler (gameObject)
{
    gameObject.tint = 0xff0000;
}
