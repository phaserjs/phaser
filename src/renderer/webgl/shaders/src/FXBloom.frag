#define SHADER_NAME BLOOM_FS

precision mediump float;

uniform sampler2D uMainSampler;

uniform vec2 uOffset;
uniform float uStrength;
uniform vec3 uColor;

varying vec2 outTexCoord;

void main ()
{
    vec4 sum = texture2D(uMainSampler, outTexCoord) * 0.204164 * uStrength;

    sum = sum + texture2D(uMainSampler, outTexCoord + uOffset * 1.407333) * 0.304005;
    sum = sum + texture2D(uMainSampler, outTexCoord - uOffset * 1.407333) * 0.304005;
    sum = sum + texture2D(uMainSampler, outTexCoord + uOffset * 3.294215) * 0.093913;

    gl_FragColor = (sum + texture2D(uMainSampler, outTexCoord - uOffset * 3.294215) * 0.093913) * vec4(uColor, 1);
}
