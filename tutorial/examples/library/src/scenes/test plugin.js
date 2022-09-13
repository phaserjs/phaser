var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        plugins: [ 'Loader' ],
        map: {
            'load': 'load',
            'add': 'add'
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('face', 'assets/pics/bw-face.png');
}

function create ()
{
    console.log(this);

    this.add.image(400, 300, 'face');
}
