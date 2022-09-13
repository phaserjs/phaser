var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var CustomPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.MultiPipeline,

    initialize:

    function CustomPipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.MultiPipeline.call(this, {
            game: game,
            fragShader: `
            precision mediump float;

            uniform sampler2D uMainSampler[%count%];
            uniform vec2 uResolution;
            uniform float uTime;

            varying vec2 outTexCoord;
            varying float outTexId;
            varying vec4 outTint;

            vec4 plasma()
            {
                vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
                float freq = 0.8;
                float value =
                    sin(uTime + pixelPos.x * freq) +
                    sin(uTime + pixelPos.y * freq) +
                    sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
                    cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

                return vec4(
                    cos(value),
                    sin(value),
                    sin(value * 3.14 * 2.0),
                    cos(value)
                );
            }

            void main()
            {
                vec4 texture;

                %forloop%

                texture *= vec4(outTint.rgb * outTint.a, outTint.a);

                gl_FragColor = texture * plasma();
            }
            `,
            uniforms: [
                'uProjectionMatrix',
                'uViewMatrix',
                'uModelMatrix',
                'uMainSampler',
                'uResolution',
                'uTime'
            ]
        });
    }
});

var game = new Phaser.Game(config);

var bunny;
var time = 0;
var customPipeline;

function preload ()
{
    this.load.image('beball', 'assets/sprites/beball1.png');
    this.load.image('atari', 'assets/sprites/atari400.png');
    this.load.image('bikkuriman', 'assets/sprites/bikkuriman.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
    customPipeline = this.renderer.pipelines.add('Custom', new CustomPipeline(game));

    customPipeline.set2f('uResolution', game.config.width, game.config.height);

    this.add.sprite(100, 300, 'beball');
    this.add.sprite(400, 300, 'atari').setPipeline('Custom');
    bunny = this.add.sprite(400, 300, 'bunny').setPipeline('Custom');
    this.add.sprite(700, 300, 'bikkuriman');

    this.input.on('pointermove', function (pointer) {
        bunny.x = pointer.x;
        bunny.y = pointer.y;
    }, this);

    this.input.on('pointerdown', function (pointer) {

        if (bunny.pipeline === customPipeline)
        {
            bunny.resetPipeline();
        }
        else
        {
            bunny.setPipeline('Custom');
        }

    }, this);
}

function update ()
{
    customPipeline.set1f('uTime', time);

    time += 0.05;

    bunny.rotation += 0.01;
}
