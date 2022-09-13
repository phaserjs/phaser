var CustomPipeline1 = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function CustomPipeline1 (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader: [
            "precision mediump float;",

            "uniform float     time;",
            "uniform vec2      resolution;",
            "uniform sampler2D uMainSampler;",
            "varying vec2 outTexCoord;",

            "#define PI 0.01",

            "void main( void ) {",

                "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;",
                "float sx = 0.2*sin( 25.0 * p.y - time * 5.);",
                "float dy = 2.9 / ( 20.0 * abs(p.y - sx));",
                "vec4 pixel = texture2D(uMainSampler, outTexCoord);",

                "gl_FragColor = pixel * vec4( (p.x + 0.5) * dy, 0.5 * dy, dy-1.65, pixel.a );",

            "}"
            ].join('\n')
        });
    } 

});

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

    customPipeline1 = game.renderer.addPipeline('Custom1', new CustomPipeline1(game));
    customPipeline2 = game.renderer.addPipeline('Custom2', new CustomPipeline2(game));

    customPipeline1.setFloat2('resolution', game.config.width, game.config.height);
}

function create ()
{
    image = this.add.image(128, 64, 'einstein');

    //  1024 x 512 = 4 x 4 = 256 x 128
    //  We're going to create 16 cameras in a 4x4 grid, making each 256 x 128 in size

    var cam = this.cameras.main;

    cam.setSize(256, 128);

    cam.setRenderToTexture(customPipeline1);

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
                cam.setRenderToTexture(customPipeline2);
                b = 1;
            }
            else
            {
                cam.setRenderToTexture(customPipeline1);
                b = 0;
            }
        }
    }
}

function update ()
{
    image.rotation += 0.01;

    customPipeline1.setFloat1('time', time);
    customPipeline2.setFloat1('time', time);

    time += 0.005;
}
