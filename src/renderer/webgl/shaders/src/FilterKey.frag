// KEY_FS
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec4 uColor;
uniform vec4 uIsolateThresholdFeather;

varying vec2 outTexCoord;

void main()
{
    vec4 color = texture2D(uMainSampler, outTexCoord);
    vec3 unpremultipliedColor = color.rgb / color.a;

    float isolate = uIsolateThresholdFeather.x;
    float threshold = uIsolateThresholdFeather.y;
    float feather = uIsolateThresholdFeather.z;

    float match = distance(unpremultipliedColor, uColor.rgb);

    // Threshold the match.
    match = clamp(match - threshold, 0.0, 1.0);

    // Feather the match.
    match = clamp(match / feather, 0.0, 1.0);

    if (isolate == 1.0)
    {
        match = 1.0 - match;
    }

    match = mix(1.0, match, uColor.a);

    gl_FragColor = color * match;
}
