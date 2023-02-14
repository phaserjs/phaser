#define SHADER_NAME BLUR_HIGH_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 resolution;
uniform vec2 offset;
uniform float strength;
uniform vec3 color;

varying vec2 outTexCoord;

void main ()
{
    vec2 uv = outTexCoord;

    vec4 col = vec4(0.0);

    vec2 off1 = vec2(1.411764705882353) * offset * strength;
    vec2 off2 = vec2(3.2941176470588234) * offset * strength;
    vec2 off3 = vec2(5.176470588235294) * offset * strength;

    col += texture2D(uMainSampler, uv) * 0.1964825501511404;
    col += texture2D(uMainSampler, uv + (off1 / resolution)) * 0.2969069646728344;
    col += texture2D(uMainSampler, uv - (off1 / resolution)) * 0.2969069646728344;
    col += texture2D(uMainSampler, uv + (off2 / resolution)) * 0.09447039785044732;
    col += texture2D(uMainSampler, uv - (off2 / resolution)) * 0.09447039785044732;
    col += texture2D(uMainSampler, uv + (off3 / resolution)) * 0.010381362401148057;
    col += texture2D(uMainSampler, uv - (off3 / resolution)) * 0.010381362401148057;

    gl_FragColor = col * vec4(color, 1.0);
}
