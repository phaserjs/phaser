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
    //  This handler will only be called once, no matter how many times the event fires
    this.events.once('addImage', handler, this);

    //  We emit the event 3 times, but the handler is only called once
    this.events.emit('addImage');
    this.events.emit('addImage');
    this.events.emit('addImage');
}

function handler ()
{
    var x = Phaser.Math.Between(200, 600);
    var y = Phaser.Math.Between(200, 400);

    this.add.image(x, y, 'plush');
}
