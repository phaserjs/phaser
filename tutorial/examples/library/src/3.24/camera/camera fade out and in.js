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
    this.load.image('robota', 'assets/pics/robota-uxo-by-made-of-bomb.jpg');
    this.load.image('neuromancer', 'assets/pics/neuromancer.jpg');
}

function create ()
{
    this.add.image(400, 300, 'robota');

    this.cameras.main.once('camerafadeoutcomplete', function (camera) {

        this.add.image(400, 300, 'neuromancer');

        camera.fadeIn(6000, 255);

    }, this);

    this.cameras.main.fadeOut(6000, 255);
}
