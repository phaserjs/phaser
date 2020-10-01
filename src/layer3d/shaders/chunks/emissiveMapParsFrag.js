module.exports = [
    '#ifdef USE_EMISSIVEMAP',
    '',
    '	uniform sampler2D emissiveMap;',
    '',
    '#endif'
].join('\n');
