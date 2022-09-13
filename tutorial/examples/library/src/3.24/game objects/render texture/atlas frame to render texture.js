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
    this.load.image('uv', 'assets/pics/uv-grid-4096-ian-maclachlan.png');
}

function create ()
{
    // var rt = this.add.renderTexture(0, 0, 400, 300);
    // var rt = this.add.renderTexture(0, 0, 800, 600);
    // var rt = this.add.renderTexture(0, 0, 4096, 4096);
    // var rt = this.add.renderTexture(0, 0, 1024, 1024);
    // var rt = this.add.renderTexture(0, 0, 1024, 512);
    var rt = this.add.renderTexture(0, 0, 512, 512);

    var atlasTexture = this.textures.get('megaset');
    var frames = atlasTexture.getFrameNames();

    rt.drawFrame('uv', null, 0, 0);

    for (var i = 0; i < frames.length / 4; i++)
    {
        var x = Phaser.Math.Between(0, rt.frame.width);
        var y = Phaser.Math.Between(0, rt.frame.height);

        rt.drawFrame('megaset', frames[i], x, y);
    }
}
