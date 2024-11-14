struct Light
{
    vec3 position;
    vec3 color;
    float intensity;
    float radius;
};

// #define LIGHT_COUNT N
const int kMaxLights = LIGHT_COUNT;

uniform vec4 uCamera; /* x, y, rotation, zoom */
uniform sampler2D uNormSampler;
uniform vec3 uAmbientLightColor;
uniform Light uLights[kMaxLights];
uniform int uLightCount;
#ifdef FEATURE_SELFSHADOW
uniform float uDiffuseFlatThreshold;
uniform float uPenumbra;
#endif

vec4 getLighting (vec4 fragColor, vec3 normal)
{
    vec3 finalColor = vec3(0.0);
    vec2 res = vec2(min(uResolution.x, uResolution.y)) * uCamera.w;

    #ifdef FEATURE_SELFSHADOW
    vec3 unpremultipliedColor = fragColor.rgb / fragColor.a;
    float occlusionThreshold = 1.0 - ((unpremultipliedColor.r + unpremultipliedColor.g + unpremultipliedColor.b) / uDiffuseFlatThreshold);
    #endif

    for (int index = 0; index < kMaxLights; ++index)
    {
        if (index < uLightCount)
        {
            Light light = uLights[index];
            vec3 lightDir = vec3((light.position.xy / res) - (gl_FragCoord.xy / res), light.position.z / res.x);
            vec3 lightNormal = normalize(lightDir);
            float distToSurf = length(lightDir) * uCamera.w;
            float diffuseFactor = max(dot(normal, lightNormal), 0.0);
            float radius = (light.radius / res.x * uCamera.w) * uCamera.w;
            float attenuation = clamp(1.0 - distToSurf * distToSurf / (radius * radius), 0.0, 1.0);
            #ifdef FEATURE_SELFSHADOW
            float occluded = smoothstep(0.0, 1.0, (diffuseFactor - occlusionThreshold) / uPenumbra);
            vec3 diffuse = light.color * diffuseFactor * occluded;
            #else
            vec3 diffuse = light.color * diffuseFactor;
            #endif
            finalColor += (attenuation * diffuse) * light.intensity;
        }
    }

    vec4 colorOutput = vec4(uAmbientLightColor + finalColor, 1.0);

    return colorOutput;
}