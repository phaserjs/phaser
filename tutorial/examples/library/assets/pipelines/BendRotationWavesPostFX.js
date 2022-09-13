const fragShader = `
#define SHADER_NAME BEND_ROTATION_WAVES_FS

precision mediump float;

uniform float     uTime;
uniform sampler2D uMainSampler;

float speed = uTime * 0.2;
float pi = 3.14159265;

void main( void )
{
    vec2 position = vec2(512.0/2.0+512.0/2.0*sin(speed*2.0), 400.0/2.0+400.0/2.0*cos(speed*3.0));
    vec2 position2 = vec2(512.0/2.0+512.0/2.0*sin((speed+2000.0)*2.0), 400.0/2.0+400.0/2.0*cos((speed+2000.0)*3.0));

    vec2 offset = vec2(512.0/2.0, 400.0/2.0);
    vec2 offset2 = vec2(6.0*sin(speed*1.1), 3.0*cos(speed*1.1));

    vec2 oldPos = (gl_FragCoord.xy-offset);

    float angle = speed*2.0;

    vec2 newPos = vec2(oldPos.x *cos(angle) - oldPos.y *sin(angle),
    oldPos.y *cos(angle) + oldPos.x *sin(angle));

    newPos = (newPos)*(0.0044+0.004*sin(speed*3.0))-offset2;
    // Fix - axis Y inverted
    newPos.y = -newPos.y;
    vec2 temp = newPos;
    newPos.x = temp.x + 0.4*sin(temp.y*2.0+speed*8.0);
    newPos.y = (-temp.y + 0.4*sin(temp.x*2.0+speed*8.0));
    vec4 final = texture2D(uMainSampler,newPos);
    // final = texture2D(texCol,gl_FragCoord.xy*vec2(1.0/512, -1.0/400));
    gl_FragColor = vec4(final.xyz, 1.0);
}
`;

export default class BendRotationWaves extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
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
