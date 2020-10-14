#define SHADER_NAME PHASER_POINTLIGHT_FS

precision mediump float;

uniform vec2 uResolution;

varying vec4 lightPosition;
varying vec4 lightColor;
varying float lightRadius;

void main()
{
    vec2 center = vec2((lightPosition.x + 1.0) * uResolution.x, (lightPosition.y + 1.0) * uResolution.y);

    float distance = length(center - gl_FragCoord.xy);

    float attenuation = 1.0 / (0.01 * distance * distance);
    float radius = 1.0 - min(distance, lightRadius) / lightRadius;
    float intensity = smoothstep(0.0, 1.0, min(attenuation, radius));

    vec4 color = vec4(intensity, intensity, intensity, 0.0) * lightColor;

    gl_FragColor = vec4(color.rgb * lightColor.a, color.a);
}
