module.exports = [
    'struct DirectLight',
    '{',
    '    vec3 direction;',
    '    vec4 color;',
    '',
    '    int shadow;',
    '    float shadowBias;',
    '    float shadowRadius;',
    '    vec2 shadowMapSize;',
    '};',
    'uniform DirectLight u_Directional[NUM_DIR_LIGHTS];'
].join('\n');
