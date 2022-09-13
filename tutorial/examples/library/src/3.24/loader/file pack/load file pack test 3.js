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
    this.load.pack('pack1', 'assets/loader-tests/pack1.json');
}

function create ()
{
    this.add.image(400, 300, 'taikodrummaster');
    this.add.image(900, 300, 'TEST2.donuts');
    this.add.image(400, 500, 'sukasuka-chtholly');
    this.add.image(180, 300, 'TEST2.ayu');
}
