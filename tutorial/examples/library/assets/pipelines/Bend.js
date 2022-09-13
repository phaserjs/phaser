const bendFragShader = `
#define SHADER_NAME BEND_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uBendFactor;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    float height = 1.0 - outTexCoord.y;
    float offset = pow(height, 2.5);

    offset *= (sin(uTime * uSpeed) * uBendFactor);

    vec4 texture = texture2D(uMainSampler, fract(vec2(outTexCoord.x + offset, outTexCoord.y)));

    gl_FragColor = texture;
}
`;

const bendUniforms = [
    'uProjectionMatrix',
    'uMainSampler',
    'uTime',
    'uSpeed',
    'uBendFactor'
];

export default class BendPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline
{
    constructor (game)
    {
        super({
            game,
            shaders: [
                {
                    name: 'Bend',
                    fragShader: bendFragShader,
                    uniforms: bendUniforms
                }
            ]
        });

        this._bend = 0.3;
        this._speed = 0.003;
    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time);
        this.set1f('uSpeed', this._speed);
        this.set1f('uBendFactor', this._bend);
    }

    get bend ()
    {
        return this._bend;
    }

    set bend (value)
    {
        this._bend = value;
    }

    get speed ()
    {
        return this._speed;
    }

    set speed (value)
    {
        this._speed = value;
    }
}
