// BLUR_LOW_FS
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 resolution;
uniform vec2 offset;
uniform float strength;
uniform vec3 color;

varying vec2 outTexCoord;

#pragma phaserTemplate(fragmentHeader)

void main ()
{
    vec2 uv = outTexCoord;

    vec4 col = vec4(0.0);

    vec2 offset = vec2(1.333) * offset * strength;

    col += boundedSampler(uMainSampler, uv) * 0.29411764705882354;
    col += boundedSampler(uMainSampler, uv + (offset / resolution)) * 0.35294117647058826;
    col += boundedSampler(uMainSampler, uv - (offset / resolution)) * 0.35294117647058826;

    gl_FragColor = col * vec4(color, 1.0);
}
