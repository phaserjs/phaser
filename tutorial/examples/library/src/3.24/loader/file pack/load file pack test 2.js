var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.pack('pack1', 'assets/loader-tests/pack1.json', 'test2');
}

function create ()
{
    this.add.image(400, 300, 'TEST2.donuts');
    this.add.image(500, 300, 'TEST2.ayu');
}
