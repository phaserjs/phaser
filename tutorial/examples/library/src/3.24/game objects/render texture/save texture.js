var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var rt;

function preload ()
{
    this.load.image('bubble', 'assets/particles/bubble.png');
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    rt = this.make.renderTexture({ width: 100, height: 100 }, false);

    rt.draw('bubble', 0, 0);
    rt.draw('dude', 20, 14);

    var t = rt.saveTexture('bubbleboy');

    for (var i = 0; i < 100; i++)
    {
        this.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'bubbleboy');
    }
}
