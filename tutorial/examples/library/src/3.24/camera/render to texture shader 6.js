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
}

function create ()
{
    this.add.image(400, 300, 'volcano').setAlpha(1);
    this.add.image(400, 300, 'hotdog').setScrollFactor(0);

    this.cameras.main.setRenderToTexture(customPipeline);

    // this.cameras.add(0, 0, 200, 150).setZoom(0.25);

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
