module.exports = [
    '#ifdef USE_ENV_MAP',
    '    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)',
    '        varying vec3 v_worldPos;',
    '    #else',
    '        varying vec3 v_EnvPos;',
    '    #endif',
    '#endif'
].join('\n');
