module.exports = [
    'struct PointLight',
    '{',
    '    vec3 position;',
    '    vec4 color;',
    '    float distance;',
    '    float decay;',
    '',
    '    int shadow;',
    '    float shadowBias;',
    '    float shadowRadius;',
    '    vec2 shadowMapSize;',
    '',
    '    float shadowCameraNear;',
    '    float shadowCameraFar;',
    '};',
    'uniform PointLight u_Point[NUM_POINT_LIGHTS];'
].join('\n');
