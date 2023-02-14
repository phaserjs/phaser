#define SHADER_NAME LINEAR_GRADIENT_FS
#define SRGB_TO_LINEAR(c) pow((c), vec3(2.2))
#define LINEAR_TO_SRGB(c) pow((c), vec3(1.0 / 2.2))
#define SRGB(r, g, b) SRGB_TO_LINEAR(vec3(float(r), float(g), float(b)) / 255.0)

precision mediump float;

uniform sampler2D uMainSampler;

uniform vec3 color1;
uniform vec3 color2;
uniform float alpha;
uniform int size;

varying vec2 outTexCoord;

float stepped (in float s, in float scale, in int steps)
{
    return steps > 0 ? floor( s / ((1.0 * scale) / float(steps))) * 1.0 / float(steps - 1) : s;
}

void main ()
{
    float s = stepped(outTexCoord.y, 1.0, size);

    vec3 color = mix(SRGB(color1.r, color1.g, color1.b), SRGB(color2.r, color2.g, color2.b), s);

    color = LINEAR_TO_SRGB(color);

    vec4 texture = texture2D(uMainSampler, outTexCoord);

    gl_FragColor = vec4(mix(texture.rgb, color.rgb, alpha), 1.0) * texture.a;
}
