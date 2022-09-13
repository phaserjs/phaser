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
}

function create ()
{
    var image = this.add.image(900, 300, 'robota');

    this.tweens.add({
        targets: image,
        x: 100,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        duration: 3000
    });

    this.cameras.main.once('camerafadeincomplete', function (camera) {

        camera.fadeOut(6000);

    });

    this.cameras.main.fadeIn(6000);
}
