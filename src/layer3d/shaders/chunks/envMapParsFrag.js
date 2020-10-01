module.exports = [
    '#ifdef USE_ENV_MAP',
    '    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)',
    '        varying vec3 v_worldPos;',
    '    #else',
    '        varying vec3 v_EnvPos;',
    '    #endif',
    '    uniform samplerCube envMap;',
    '    uniform float u_EnvMap_Intensity;',
    '    uniform int maxMipLevel;',
    '#endif'
].join('\n');
