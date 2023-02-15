#define SHADER_NAME CIRCLE_FS

precision mediump float;

uniform sampler2D uMainSampler;

uniform vec2 resolution;
uniform vec3 color;
uniform vec4 backgroundColor;
uniform float thickness;
uniform float scale;
uniform float feather;

varying vec2 outTexCoord;

void main ()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    vec2 position = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;

    float aspectRatio = resolution.x / resolution.y;

    position.x *= aspectRatio;

    float grad = length(position);

    //  height > width
    float outer = aspectRatio;
    float inner = outer - (thickness * 2.0 / resolution.y);

    //  width > height
    if (aspectRatio >= 1.0)
    {
        float f = 2.0 + (resolution.y / resolution.x);
        outer = 1.0;
        inner = 1.0 - (thickness * f / resolution.x);
    }

    outer *= scale;
    inner *= scale;

    float circle = smoothstep(outer, outer - 0.01, grad);

    float ring = circle - smoothstep(inner, inner - feather, grad);

    texture = mix(backgroundColor * backgroundColor.a, texture, texture.a);

    texture = (texture * (circle - ring));

    gl_FragColor = vec4(texture.rgb + (ring * color), texture.a);
}
