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
    var rt = this.add.renderTexture(0, 0, 800, 650);

    var atlasTexture = this.textures.get('megaset');

    // var frames = atlasTexture.getFrameNames();

    // var bob = this.add.image(0, 0, 'megaset', 'ilkke').setOrigin(0);
    // rt.draw(bob, 0, 0);

    rt.drawFrame('megaset', 'ilkke', 0, 0);

    /*
    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    console.log(frames);

    // rt.drawFrame('megaset', 'contra1', 0, 0);
    // rt.drawFrame('megaset', 'contra1', 0, 400);

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        rt.drawFrame('megaset', frames[i], x, y);
    }
    */
}
