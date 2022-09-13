const vertShader = `
precision mediump float;

uniform mat4 uProjectionMatrix;
uniform vec2 uResolution;

attribute vec2 inPosition;
attribute vec2 inTexCoord;
attribute float inTexId;
attribute float inTintEffect;
attribute vec4 inTint;

varying vec2 outTexCoord;
varying float outTexId;
varying float outTintEffect;
varying vec4 outTint;

varying vec2 fragCoord;

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);

    outTexCoord = inTexCoord;
    outTexId = inTexId;
    outTint = inTint;
    outTintEffect = inTintEffect;

    fragCoord = vec2(inPosition.x, uResolution.y - inPosition.y);
}
`;

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler[%count%];
uniform vec2 uResolution;
uniform float uTime;

varying vec2 outTexCoord;
varying float outTexId;
varying float outTintEffect;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture;

    %forloop%

    texture *= vec4(outTint.rgb * outTint.a, outTint.a);

    vec3 p = vec3((fragCoord.xy)/(uResolution.y),sin(uTime * 0.2));

    for (int i = 0; i < 10; i++)
    {
        p.xzy = vec3(1.3,0.999,0.7)*(abs((abs(p)/dot(p,p)-vec3(1.0,1.0,cos(uTime * 0.2)*0.5))));
    }

    gl_FragColor.rgb = texture.rgb * p;
    gl_FragColor.a = texture.a;
}
`;

class CustomPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            vertShader,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uResolution',
                'uTime'
            ]
        });
    }
}

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.t = 0;
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
        this.customPipeline = this.renderer.pipelines.get('Custom');

        this.customPipeline.set2f('uResolution', this.scale.width, this.scale.height);

        // this.add.sprite(100, 300, 'pudding');
        this.add.sprite(100, 300, 'pudding').setPipeline(this.customPipeline);

        // this.add.sprite(400, 300, 'crab').setScale(1.5);
        this.add.sprite(400, 300, 'crab').setScale(1.5).setPipeline(this.customPipeline);

        // this.fish = this.add.sprite(400, 300, 'fish');
        this.fish = this.add.sprite(400, 300, 'fish').setPipeline(this.customPipeline);

        // this.add.sprite(700, 300, 'cake');
        this.add.sprite(700, 300, 'cake').setPipeline(this.customPipeline);

        this.input.on('pointermove', pointer => {

            this.fish.x = pointer.worldX;
            this.fish.y = pointer.worldY;

        });

        this.input.on('pointerdown', () => {

            if (this.fish.pipeline === this.customPipeline)
            {
                this.fish.resetPipeline();
            }
            else
            {
                this.fish.setPipeline(this.customPipeline);
            }

        });
    }

    update ()
    {
        this.customPipeline.set1f('uTime', this.t);

        this.t += 0.05;

        this.fish.rotation -= 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { 'Custom': CustomPipeline }
};

let game = new Phaser.Game(config);
