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
    image = this.add.image(128, 256, 'einstein');

    var cam = this.cameras.main;

    //  With shader
    cam.setSize(256, 512);
    cam.setRenderToTexture(customPipeline2);

    //  No shader
    cam = this.cameras.add(256, 0, 256, 512);

    //  With shader
    cam = this.cameras.add(512, 0, 256, 512);
    cam.setRenderToTexture(customPipeline2);

    //  No shader
    cam = this.cameras.add(768, 0, 256, 512);
}

function update ()
{
    image.rotation += 0.01;

    customPipeline2.setFloat1('time', time);

    time += 0.005;
}
