// #module

const fragShader = `
#define SHADER_NAME GRAYSCALE

precision mediump float;

uniform sampler2D uMainSampler[%count%];
uniform float gray;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture;

    %forloop%

    gl_FragColor = texture;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);
}
`;

class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'gray'
            ]
        });

        this._gray = 1;
    }

    onPreRender ()
    {
        this.set1f('gray', this._gray);
    }

    get gray ()
    {
        return this._gray;
    }

    set gray (value)
    {
        this._gray = value;
    }
}

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setPath('assets/tests/pipeline/');

        this.load.image('cake', 'cake.png');
        this.load.image('crab', 'crab.png');
        this.load.image('fish', 'fish.png');
        this.load.image('pudding', 'pudding.png');
    }

    create ()
    {
        const grayscalePipeline = this.renderer.pipelines.add('Gray', new GrayScalePipeline(this.game));

        this.add.sprite(100, 300, 'pudding');

        this.add.sprite(400, 300, 'crab').setScale(1.5).setPipeline(grayscalePipeline);

        this.fish = this.add.sprite(400, 300, 'fish').setPipeline(grayscalePipeline);

        this.add.sprite(700, 300, 'cake');

        this.input.on('pointermove', pointer => {

            this.fish.x = pointer.worldX;
            this.fish.y = pointer.worldY;

        });

        this.tweens.add({
            targets: grayscalePipeline,
            delay: 2000,
            repeatDelay: 2000,
            gray: 0,
            yoyo: true,
            repeat: -1
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
