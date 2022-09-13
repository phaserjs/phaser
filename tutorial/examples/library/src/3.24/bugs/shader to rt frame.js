var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt;
var frames;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.glsl('bundle', 'assets/shaders/bundle2.glsl.js');
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
}

function create ()
{
    //  Our shader is 512x512
    var shader = this.add.shader('Marble', 0, 0, 512, 512);

    shader.setRenderToTexture('wibble');

    //  Get it from the Texture Manager
    var shaderTexture = this.textures.get('wibble');

    var i = 0;
    
    frames = [];

    for (var y = 0; y < 512; y += 128)
    {
        for (var x = 0; x < 512; x += 128)
        {
            var frame = shaderTexture.add('Frame' + i, 0, x, y, 128, 128);

            frames.push('Frame' + i);

            i++;
        }
    }

    frames = Phaser.Utils.Array.Shuffle(frames);

    rt = this.add.renderTexture(0, 0, 512, 512);
}

function update ()
{
    var i = 0;

    for (var y = 0; y < 512; y += 128)
    {
        for (var x = 0; x < 512; x += 128)
        {
            rt.drawFrame('wibble', frames[i], x, y);

            i++;
        }
    }
}
