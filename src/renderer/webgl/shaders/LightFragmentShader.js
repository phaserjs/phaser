var LightFragmentShader = function (maxLights)
{
    var frag = [
        '// Light Fragment Shader ',

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
        'uniform sampler2D uMainTexture;',
        'uniform sampler2D uNormTexture;',
        'uniform vec3 uAmbientLightColor;',
        'uniform Light uLights[' + maxLights + '];',

        'varying vec2 v_tex_coord;',
        'varying vec3 v_color;',
        'varying float v_alpha;',

        'void main()',
        '{',
        '    vec3 finalColor = vec3(0.0, 0.0, 0.0);',
        '    vec4 spriteColor = texture2D(uMainTexture, v_tex_coord) * vec4(v_color, v_alpha);',
        '    vec3 spriteNormal = texture2D(uNormTexture, v_tex_coord).rgb;',
        '    vec3 normal = normalize(vec3(spriteNormal * 2.0 - 1.0));',
        '    vec2 res = vec2(min(uResolution.x, uResolution.y)) * uCamera.w;',

        '    for (int index = 0; index < ' + maxLights + '; ++index)',
        '    {',
        '        Light light = uLights[index];',
        '        vec3 lightDir = vec3((light.position.xy / res) - (gl_FragCoord.xy / res), light.position.z);',
        '        vec3 lightNormal = normalize(lightDir);',
        '        float distToSurf = length(lightDir) * uCamera.w;',
        '        float diffuseFactor = max(dot(normal, lightNormal), 0.0);',
        '        float radius = (light.radius / res.x * uCamera.w) * uCamera.w;',
        '        float attenuation = clamp(1.0 - distToSurf * distToSurf / (radius * radius), 0.0, 1.0);',
        '        vec3 diffuse = light.color * spriteColor.rgb * diffuseFactor;',
        '        finalColor += attenuation * diffuse;',
        '    }',

        '    vec4 color_output = vec4(uAmbientLightColor + finalColor, spriteColor.a);',
        '    gl_FragColor = vec4(color_output.rgb * color_output.a, color_output.a);',
        '}'
    ];

    return frag.join('\n');
};

module.exports = LightFragmentShader;
