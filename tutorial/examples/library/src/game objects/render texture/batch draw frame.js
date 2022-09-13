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
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
}

function create ()
{
    var rt = this.add.renderTexture(0, 0, 800, 800);

    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    rt.beginDraw();

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        rt.batchDrawFrame('megaset', frames[i], x, y);
    }

    rt.endDraw();
}
