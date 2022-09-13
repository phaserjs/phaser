const fragShader = `
#define SHADER_NAME LAZER_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 outTexCoord;

#define PI 0.01

void main()
{
    vec2 p = (gl_FragCoord.xy / uResolution.xy) - 0.5;
    float sx = 0.2 * sin(25.0 * p.y - uTime);
    float dy = 2.9 / (20.0 * abs(p.y - sx));
    vec4 pixel = texture2D(uMainSampler, outTexCoord);

    gl_FragColor = pixel * vec4((p.x + 0.5) * dy, 0.5 * dy, dy - 1.65, pixel.a);
}
`;

export default class LazersPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
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
                'uResolution'
            ]
        });
    }

    onBoot ()
    {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);
    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time / 1000);
    }
}
