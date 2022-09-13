var CustomPipeline2 = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function CustomPipeline2 (game)
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

            "#define MAX_ITER 4",

            "void main( void )",
            "{",
                "vec2 v_texCoord = gl_FragCoord.xy / resolution;",

                "vec2 p =  v_texCoord * 8.0 - vec2(20.0);",
                "vec2 i = p;",
                "float c = 1.0;",
                "float inten = .05;",

                "for (int n = 0; n < MAX_ITER; n++)",
                "{",
                    "float t = time * (1.0 - (3.0 / float(n+1)));",

                    "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
                    "sin(t - i.y) + cos(t + i.x));",

                    "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
                    "p.y / (cos(i.y+t)/inten)));",
                "}",

                "c /= float(MAX_ITER);",
                "c = 1.5 - sqrt(c);",

                "vec4 texColor = vec4(0.0, 0.01, 0.015, 1.0);",

                "texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));",
                "vec4 pixel = texture2D(uMainSampler, outTexCoord);",

                "gl_FragColor = pixel + texColor;",
            "}"
            ].join('\n')
        });
    } 

});

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var time = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('volcano', 'assets/pics/remember-me.jpg');
    this.load.image('hotdog', 'assets/sprites/hotdog.png');

    customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline2(game));
    customPipeline.setFloat2('resolution', game.config.width, game.config.height);
}

function create ()
{
    this.add.image(400, 300, 'volcano').setAlpha(0.2);
    this.add.image(400, 300, 'hotdog').setScrollFactor(0);

    this.cameras.main.setRenderToTexture(customPipeline);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (t, delta)
{
    controls.update(delta);

    customPipeline.setFloat1('time', time);

    time += 0.005;
}
