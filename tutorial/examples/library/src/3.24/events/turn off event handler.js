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

var i = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('plush', 'assets/pics/profil-sad-plush.png');
}

function create ()
{
    //  Call this handler.
    //  Within the handler it will disable itself after 5 calls.
    this.events.on('addImage', handler, this);

    //  Emit the event 10 times
    for (var i = 0; i < 10; i++)
    {
        this.events.emit('addImage');
    }
}

function handler ()
{
    var x = Phaser.Math.Between(100, 700);
    var y = Phaser.Math.Between(100, 500);

    this.add.image(x, y, 'plush');

    i++;

    if (i === 5)
    {
        this.events.off('addImage', handler);
    }
}
