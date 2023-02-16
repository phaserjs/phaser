#define SHADER_NAME DISPLACEMENT_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uDisplacementSampler;

uniform vec2 amount;

varying vec2 outTexCoord;

void main ()
{
    vec2 disp = (-vec2(0.5, 0.5) + texture2D(uDisplacementSampler, outTexCoord).rr) * amount;

    gl_FragColor = texture2D(uMainSampler, outTexCoord + disp).rgba;
}
