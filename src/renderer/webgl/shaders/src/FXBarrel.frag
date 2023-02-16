#define SHADER_NAME BARREL_FS

precision mediump float;

uniform sampler2D uMainSampler;

uniform float amount;

varying vec2 outTexCoord;

vec2 Distort(vec2 p)
{
    float theta  = atan(p.y, p.x);
    float radius = length(p);
    radius = pow(radius, amount);
    p.x = radius * cos(theta);
    p.y = radius * sin(theta);
    return 0.5 * (p + 1.0);
}

void main()
{
    vec2 xy = 2.0 * outTexCoord - 1.0;
    vec2 texCoord = outTexCoord;

    if (length(xy) < 1.0)
    {
        texCoord = Distort(xy);
    }

    gl_FragColor = texture2D(uMainSampler, texCoord);
}
