var CustomPipeline2 = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function CustomPipeline2 (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader: `
            precision mediump float;

            uniform sampler2D uMainSampler;
            uniform float time;

            varying vec2 outTexCoord;
            varying vec4 outTint;

            #define SPEED 10.0

            void main(void)
            {
                float c = cos(time * SPEED);
                float s = sin(time * SPEED);

                mat4 hueRotation = mat4(0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.0, 0.0, 0.0, 1.0) + mat4(0.701, -0.587, -0.114, 0.0, -0.299, 0.413, -0.114, 0.0, -0.300, -0.588, 0.886, 0.0, 0.0, 0.0, 0.0, 0.0) * c + mat4(0.168, 0.330, -0.497, 0.0, -0.328, 0.035, 0.292, 0.0, 1.250, -1.050, -0.203, 0.0, 0.0, 0.0, 0.0, 0.0) * s;

                vec4 pixel = texture2D(uMainSampler, outTexCoord);

                gl_FragColor = pixel * hueRotation;
            }   
            `
        });
    } 

});

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 512,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image;
var time = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');

    customPipeline2 = game.renderer.addPipeline('Custom2', new CustomPipeline2(game));
}

function create ()
{
    image = this.add.image(128, 64, 'einstein');

    var cam = this.cameras.main;

    cam.setSize(256, 128);
    cam.setRenderToTexture(customPipeline2);

    var i = 0;
    var b = 0;

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            i++;

            if (x === 0 && y === 0)
            {
                continue;
            }

            if (x === 0)
            {
                b = (b) ? 0 : 1;
            }

            cam = this.cameras.add(x * 256, y * 128, 256, 128);

            if (b === 0)
            {
                b = 1;
            }
            else
            {
                cam.setRenderToTexture(customPipeline2);
                b = 0;
            }
        }
    }
}

function update ()
{
    image.rotation += 0.01;

    customPipeline2.setFloat1('time', time);

    time += 0.005;
}
