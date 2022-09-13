const grayFragShader = `
#define SHADER_NAME GRAY_FS

precision mediump float;

uniform sampler2D uMainSampler[%count%];
uniform float uGray;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture;

    %forloop%

    gl_FragColor = texture;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), uGray);
}
`;

const grayUniforms = [
    'uProjectionMatrix',
    'uMainSampler',
    'uGray'
];

const hueFragShader = `
#define SHADER_NAME HUE_FS

precision mediump float;

uniform sampler2D uMainSampler[%count%];
uniform float uTime;
uniform float uSpeed;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture;

    %forloop%

    float c = cos(uTime * uSpeed);
    float s = sin(uTime * uSpeed);

    mat4 r = mat4(0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.0,  0.0, 0.0, 1.0);
    mat4 g = mat4(0.701, -0.587, -0.114, 0.0, -0.299, 0.413, -0.114, 0.0, -0.300, -0.588, 0.886, 0.0, 0.0, 0.0, 0.0, 0.0);
    mat4 b = mat4(0.168, 0.330, -0.497, 0.0, -0.328, 0.035, 0.292, 0.0, 1.250, -1.050, -0.203, 0.0, 0.0, 0.0, 0.0, 0.0);

    mat4 hueRotation = r + g * c + b * s;

    gl_FragColor = texture * hueRotation;
}
`;

const hueUniforms = [
    'uProjectionMatrix',
    'uMainSampler',
    'uTime',
    'uSpeed'
];

export default class MultiColorPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            shaders: [
                {
                    name: 'Gray',
                    fragShader: grayFragShader,
                    uniforms: grayUniforms
                },
                {
                    name: 'HueRotate',
                    fragShader: hueFragShader,
                    uniforms: hueUniforms
                }
            ]
        });

        this._gray = 1;
        this._speed = 0.001;
    }

    onBoot ()
    {
        this.grayShader = this.shaders[0];
        this.hueShader = this.shaders[1];

        this.set1iv('uMainSampler', this.renderer.textureIndexes, this.grayShader);
        this.set1iv('uMainSampler', this.renderer.textureIndexes, this.hueShader);
    }

    onPreRender ()
    {
        this.set1f('uGray', this._gray, this.grayShader);
        this.set1f('uTime', this.game.loop.time, this.hueShader);
        this.set1f('uSpeed', this._speed, this.hueShader);
    }

    onBind (gameObject)
    {
        super.onBind();

        const data = gameObject.pipelineData;

        if (data.effect === 0)
        {
            this.setShader(this.grayShader);
            this.set1f('uGray', data.gray, this.grayShader);
        }
        else if (data.effect === 1)
        {
            this.setShader(this.hueShader);
            this.set1f('uSpeed', data.speed, this.hueShader);
        }
    }

    onBatch (gameObject)
    {
        if (gameObject)
        {
            this.flush();
        }
    }

    get gray ()
    {
        return this._gray;
    }

    set gray (value)
    {
        this._gray = value;
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
