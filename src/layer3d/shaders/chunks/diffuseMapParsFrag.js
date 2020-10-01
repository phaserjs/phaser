module.exports = [
    '#ifdef USE_DIFFUSE_MAP',
    '    uniform sampler2D diffuseMap;',
    '#endif'
].join('\n');
