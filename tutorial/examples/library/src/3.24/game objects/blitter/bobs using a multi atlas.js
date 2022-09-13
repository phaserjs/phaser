var config = {
    type: Phaser.AUTO,
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
    this.load.multiatlas('megaset', 'assets/loader-tests/texture-packer-multi-atlas.json', 'assets/loader-tests/');
}

function create ()
{
    var blitter = this.add.blitter(0, 0, 'megaset');

    //  Create some bobs, all using different frames from the same atlas texture.
    //  Note that the x/y coordinates are relative to the blitter position.

    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 1024);
        var y = Phaser.Math.Between(0, 768);

        blitter.create(x, y, frames[i]);
    }
}
