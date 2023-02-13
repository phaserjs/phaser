#define SHADER_NAME PIXELATE_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 resolution;
uniform float amount;

varying vec2 outTexCoord;

void main ()
{
    float pixelSize = floor(2.0 + amount);

    vec2 center = pixelSize * floor(outTexCoord * resolution / pixelSize) + pixelSize * vec2(0.5, 0.5);

    vec2 corner1 = center + pixelSize * vec2(-0.5, -0.5);
    vec2 corner2 = center + pixelSize * vec2(+0.5, -0.5);
    vec2 corner3 = center + pixelSize * vec2(+0.5, +0.5);
    vec2 corner4 = center + pixelSize * vec2(-0.5, +0.5);

    vec4 pixel = 0.4 * texture2D(uMainSampler, center / resolution);

    pixel += 0.15 * texture2D(uMainSampler, corner1 / resolution);
    pixel += 0.15 * texture2D(uMainSampler, corner2 / resolution);
    pixel += 0.15 * texture2D(uMainSampler, corner3 / resolution);
    pixel += 0.15 * texture2D(uMainSampler, corner4 / resolution);

    gl_FragColor = pixel;
}
