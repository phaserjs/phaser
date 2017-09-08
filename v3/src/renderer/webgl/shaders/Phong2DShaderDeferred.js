var Phong2DShaderDeferred = function (maxLights)
{
    var vert = [
        'precision mediump float;',
        'attribute vec2 vertexPosition;',
        'void main()',
        '{',
        '    gl_Position = vec4(vertexPosition, 0.0, 1.0);',
        '}'
    ];

    var frag = [
        'precision mediump float;',

        'struct Light',
        '{',
        '    vec3 position;',
        '    vec3 color;',
        '    float attenuation;',
        '    float radius;',
        '};',

        'uniform vec4 uCamera; /* x, y, rotation, zoom */',
        'uniform vec2 uResolution;',
        'uniform sampler2D uGbufferColor;',
        'uniform sampler2D uGbufferNormal;',
        'uniform vec3 uAmbientLightColor;',
        'uniform Light uLights[' + maxLights + '];',

        'void main()',
        '{',
        '    vec2 uv = vec2(gl_FragCoord.xy / uResolution);',
        '    vec3 finalColor = vec3(0.0, 0.0, 0.0);',
        '    vec4 gbColor = texture2D(uGbufferColor, uv);',
        '    vec3 gbNormal = texture2D(uGbufferNormal, uv).rgb;',
        '    vec3 normal = normalize(vec3(gbNormal * 2.0 - 1.0));',
        '    vec2 res = vec2(min(uResolution.x, uResolution.y)) * uCamera.w;',

        '    for (int index = 0; index < ' + maxLights + '; ++index)',
        '    {                ',
        '        Light light = uLights[index];',
        '        vec3 lightDir = vec3((light.position.xy / res) - (gl_FragCoord.xy / res), light.position.z);',
        '        vec3 lightNormal = normalize(lightDir);',
        '        float distToSurf = length(lightDir) * uCamera.w;',
        '        float diffuseFactor = max(dot(normal, lightNormal), 0.0);',
        '        float radius = (light.radius / res.x * uCamera.w) * uCamera.w;',
        '        float attenuation = clamp(1.0 - distToSurf * distToSurf / (radius * radius), 0.0, 1.0);',
        '        vec3 diffuse = light.color * gbColor.rgb * diffuseFactor;',
        '        finalColor += attenuation * diffuse;',
        '    }',

        '    gl_FragColor = vec4(uAmbientLightColor + finalColor, gbColor.a);',
        '}'
    ];

    return {
        vert: vert.join('\n'),
        frag: frag.join('\n')
    };
};

module.exports = Phong2DShaderDeferred;
