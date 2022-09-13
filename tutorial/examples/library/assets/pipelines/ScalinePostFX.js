const fragShader = `
#define SHADER_NAME SCALINE_FS

precision mediump float;

uniform float     uTime;
uniform vec2      uResolution;
uniform sampler2D uMainSampler;
uniform vec2      uMouse;
varying vec2 outTexCoord;

float noise(vec2 pos) {
    return fract(sin(dot(pos, vec2(12.9898 - uTime,78.233 + uTime))) * 43758.5453);
}

void main( void ) {

    //vec2 normalPos = gl_FragCoord.xy / uResolution.xy;
    vec2 normalPos = outTexCoord;
    vec2 pointer = uMouse / uResolution;
    // FIX - Pointer inverted.
    pointer.y = (1.0-pointer.y);
    float pos = (gl_FragCoord.y / uResolution.y);
    float mouse_dist = length(vec2((pointer.x - normalPos.x) * (uResolution.x / uResolution.y), pointer.y - normalPos.y));
    float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);

    pos -= (distortion * distortion) * 0.1;

    float c = sin(pos * 400.0) * 0.4 + 0.4;
    c = pow(c, 0.2);
    c *= 0.2;

    float band_pos = fract(uTime * 0.1) * 3.0 - 1.0;
    c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;

    c += distortion * 0.08;
    // noise
    c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);

    vec4 pixel = texture2D(uMainSampler, outTexCoord);

    gl_FragColor = pixel + vec4( 0.0, c, 0.0, 1.0 );
}
`;

export default class ScalinePostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
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
                'uResolution',
                'uMouse'
            ]
        });
    }

    onBoot ()
    {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);
        console.log(this)
    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time / 1000);
        this.set2f('uMouse', this.mouseX, this.mouseY)
    }
}
