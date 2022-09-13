var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    // this.load.setPath('assets/loader-tests/');
    // this.load.multiatlas('megaset', 'texture-packer-multi-atlas.json');

    this.load.multiatlas('megaset', 'assets/loader-tests/texture-packer-multi-atlas.json', 'assets/loader-tests/');
}

function create ()
{
    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 1024);
        var y = Phaser.Math.Between(0, 768);

        this.add.image(x, y, 'megaset', frames[i]);
    }
}
