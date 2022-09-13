var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        init: init,
        preload: preload,
        create: create,
        plugins: []
    }
};

var game = new Phaser.Game(config);

function init ()
{
    //  Comment this line out and run the example.
    //  You'll see that you get a broken image instead, because this Scene doesn't have a Loader plugin available.
    this.sys.install('Loader');
}

function preload ()
{
    this.load.image('face', 'assets/pics/bw-face.png');
}

function create ()
{
    this.add.image(400, 300, 'face');
}
