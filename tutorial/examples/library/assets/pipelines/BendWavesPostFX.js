const fragShader = `
#define SHADER_NAME BEND_WAVES_FS

precision mediump float;

uniform float     uTime;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main( void )
{
    vec2 uv = outTexCoord;
    //uv.y *= -1.0;
    uv.y += (sin((uv.x + (uTime * 0.5)) * 10.0) * 0.1) + (sin((uv.x + (uTime * 0.2)) * 32.0) * 0.01);
    vec4 texColor = texture2D(uMainSampler, uv);
    gl_FragColor = texColor;
}
`;

export default class BendWaves extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    constructor (game)
    {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
            ]
        });
        this._time = 0;
    }

    onPreRender ()
    {
        this._time += 0.005;
        this.set1f('uTime', this._time);
    }
}
