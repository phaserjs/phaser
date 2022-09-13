var config = {
    type: Phaser.WEBGL,
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
    this.load.setPath('assets/loader-tests/');

    this.load.multiatlas('megaset', 'texture-packer-multi-atlas-with-normals.json');
}

function create ()
{
    var light  = this.lights.addLight(0, 0, 200);

    this.lights.enable().setAmbientColor(0x555555);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });

    this.add.image(0, 0, 'megaset', 'brick').setOrigin(0).setPipeline('Light2D');

    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    for (var i = 1; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(100, 924);
        var y = Phaser.Math.Between(100, 668);

        this.add.image(x, y, 'megaset', frames[i]).setPipeline('Light2D');
    }
}
