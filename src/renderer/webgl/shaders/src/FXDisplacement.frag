// DISPLACEMENT_FS
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uDisplacementSampler;

uniform vec2 amount;

varying vec2 outTexCoord;

#pragma phaserTemplate(fragmentHeader)

void main ()
{
    vec2 disp = (-vec2(0.5, 0.5) + texture2D(uDisplacementSampler, outTexCoord).rg) * amount;

    gl_FragColor = boundedSampler(uMainSampler, outTexCoord + disp).rgba;
}
