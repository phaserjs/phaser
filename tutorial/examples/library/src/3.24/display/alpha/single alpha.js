var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#7d2d2d',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('face', 'assets/pics/bw-face.png');
}

function create ()
{
    var image = this.add.image(400, 300, 'face');

    image.setAlpha(0.2);
}
