var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scale: {
        width: 800,
        height: 600,
        scale: 'SHOW_ALL',
        orientation: 'LANDSCAPE'
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('zero2', 'assets/pics/zero-two.png');
}

function create ()
{
    this.add.image(400, 300, 'zero2');
}
