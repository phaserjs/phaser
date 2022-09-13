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
    this.load.image('plush', 'assets/pics/profil-sad-plush.png');
}

function create ()
{
    this.events.on('addImage', handler, this);

    //  The handler function will be sent 2 arguments: x and y

    this.events.emit('addImage', 200, 300);
    this.events.emit('addImage', 400, 300);
    this.events.emit('addImage', 600, 300);
}

function handler (x, y)
{
    this.add.image(x, y, 'plush');
}
