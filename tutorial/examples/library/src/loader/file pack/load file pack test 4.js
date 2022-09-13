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
    //  This pack will load pack3.json as well
    this.load.pack('pack1', 'assets/loader-tests/pack2.json');
}

function create ()
{
    this.add.image(400, 300, 'taikodrummaster');
    this.add.image(400, 500, 'sukasuka-chtholly');
    this.add.image(200, 300, 'makoto');
    this.add.image(400, 400, 'nayuki');
}
