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
            "uniform vec2      mouse;",
            "varying vec2 outTexCoord;",

            "float noise(vec2 pos) {",
                "return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
            "}",

            "void main( void ) {",

                "//vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
                "vec2 normalPos = outTexCoord;",
                "vec2 pointer = mouse / resolution;",
                "float pos = (gl_FragCoord.y / resolution.y);",
                "float mouse_dist = length(vec2((pointer.x - normalPos.x) * (resolution.x / resolution.y), pointer.y - normalPos.y));",
                "float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);",

                "pos -= (distortion * distortion) * 0.1;",

                "float c = sin(pos * 400.0) * 0.4 + 0.4;",
                "c = pow(c, 0.2);",
                "c *= 0.2;",

                "float band_pos = fract(time * 0.1) * 3.0 - 1.0;",
                "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",

                "c += distortion * 0.08;",
                "// noise",
                "c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",

                "vec4 pixel = texture2D(uMainSampler, outTexCoord);",

                "gl_FragColor = pixel + vec4( 0.0, c, 0.0, 1.0 );",
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
    this.load.image('volcano', 'assets/pics/bw-face.png');
    this.load.image('hotdog', 'assets/sprites/hotdog.png');

    customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline2(game));
    customPipeline.setFloat2('resolution', game.config.width, game.config.height);
    customPipeline.setFloat2('mouse', 0.0, 0.0);
}

function create ()
{
    this.add.image(400, 300, 'volcano').setAlpha(0.5);
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

    this.input.on('pointermove', function (pointer) {

        customPipeline.setFloat2('mouse', pointer.x, pointer.y);

    });
}

function update (t, delta)
{
    controls.update(delta);

    customPipeline.setFloat1('time', time);

    time += 0.005;
}
