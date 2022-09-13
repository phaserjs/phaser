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

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, {
            key: 'gameScene',
            active: true,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });

        this.t = 0;
        this.customPipeline;
    },

    preload: function ()
    {
        this.load.image('logo', 'assets/sprites/phaser.png');
        this.load.setPath('assets/spine/3.8/demos/');
        this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
    },

    create: function ()
    {
        this.customPipeline = this.game.renderer.addPipeline('Custom', new CustomPipeline2(this.game));

        this.add.image(0, 0, 'logo').setOrigin(0);

        this.add.spine(400, 600, 'set1.spineboy', 'idle', true);

        this.cameras.main.setRenderToTexture(this.customPipeline);
    },

    update: function ()
    {
        this.customPipeline.setFloat1('time', this.t);

        this.t += 0.005
    }

});

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: GameScene
};

var game = new Phaser.Game(config);
