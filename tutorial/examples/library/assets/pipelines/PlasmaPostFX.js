const fragShader = `
#define SHADER_NAME PLASMA_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 outTexCoord;

void main()
{
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / uResolution.xy;

    float x = p.x;
    float y = p.y;
    float mov0 = x+y+cos(sin(uTime)*2.0)*100.+sin(x/100.)*1000.;
    float mov1 = y / 0.9 +  uTime;
    float mov2 = x / 0.2;
    float c1 = abs(sin(mov1+uTime)/2.+mov2/2.-mov1-mov2+uTime);
    float c2 = abs(sin(c1+sin(mov0/1000.+uTime)+sin(y/40.+uTime)+sin((x+y)/100.)*3.));
    float c3 = abs(sin(c2+cos(mov1+mov2+c2)+cos(mov2)+sin(x/1000.)));

    vec4 pixel = texture2D(uMainSampler, outTexCoord);

    gl_FragColor = pixel * vec4(c1, c2, c3, 1);
}
`;

export default class PlasmaPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    constructor (game)
    {
        super({
            game,
            name: 'PlasmaPostFX',
            fragShader,
            uniforms: [
                'uMainSampler',
                'uTime',
                'uResolution'
            ]
        });
    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time / 1000);
    }

    onDraw (renderTarget)
    {
        this.set2f('uResolution', renderTarget.width, renderTarget.height);

        this.bindAndDraw(renderTarget);
    }
}
