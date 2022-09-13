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

function preload ()
{
    this.load.image('brush', 'assets/sprites/apple.png');
}

function create ()
{
    var rt = this.add.renderTexture(0, 0, 800, 800);

    var brush = this.add.image(0, 0, 'brush');

    rt.beginDraw();

    for (var i = 0; i < 512; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        rt.batchDraw(brush, x, y);
    }

    rt.endDraw();
}
