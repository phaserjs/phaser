var config = {
    type: Phaser.HEADLESS,
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
    this.load.image('pic', 'assets/pics/baal-loader.png');
}

function create ()
{
    var pic = this.add.image(400, 300, 'pic');

    this.tweens.add({
        targets: pic,
        angle: 360,
        repeat: -1
    });
}
