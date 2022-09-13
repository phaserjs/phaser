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
            uniform vec2 uResolution;
            uniform float uTime;

            varying vec2 outTexCoord;
            varying vec4 outTint;

            void main() 
            {
                vec2 pixelSize = vec2(8.0, 8.0);
                vec2 dimensions = vec2(800.0, 600.0);
                vec2 size = dimensions.xy / pixelSize;
                vec2 color = floor((outTexCoord * size)) / size + pixelSize/dimensions.xy * 0.5;

                gl_FragColor = texture2D(uMainSampler, color);
            }
            `
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
    this.load.image('volcano', 'assets/pics/the-end-by-iloe-and-made.jpg');
    this.load.image('hotdog', 'assets/sprites/hotdog.png');

    customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline2(game));
    // customPipeline.setFloat2('uResolution', game.config.width, game.config.height);
}

function create ()
{
    var volcano = this.add.image(400, 300, 'volcano');
    var hotdog = this.add.image(400, 300, 'hotdog').setScrollFactor(0);

    // this.cameras.main.setBounds(-560, -240, 1920, 1080);
    this.cameras.main.ignore(hotdog);
    this.cameras.main.setRenderToTexture();
    // this.cameras.main.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    // this.cameras.main.setAlpha(1, 0, 1, 0);

    var cam1 = this.cameras.add(0, 0, 800, 600);

    cam1.ignore(volcano);

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

function update (time, delta)
{
    controls.update(delta);

    // customPipeline.setFloat1('uTime', time);

    time += 0.05;
}
