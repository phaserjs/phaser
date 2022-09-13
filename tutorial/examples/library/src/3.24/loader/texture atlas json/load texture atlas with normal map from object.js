var config = {
    type: Phaser.WEBGL,
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
    this.load.setPath('assets/loader-tests/');

    this.load.atlas({
        key: 'megaset',
        textureURL: 'texture-packer-atlas-with-normals-0.png',
        normalMap: 'texture-packer-atlas-with-normals-0_n.png',
        atlasURL: 'texture-packer-atlas-with-normals.json'
    });
}

function create ()
{
    var light  = this.lights.addLight(0, 0, 200);

    this.lights.enable().setAmbientColor(0x555555);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });

    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    Phaser.Utils.Array.Shuffle(frames);

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(100, 700);
        var y = Phaser.Math.Between(100, 500);

        this.add.image(x, y, 'megaset', frames[i]).setPipeline('Light2D');
    }
}
