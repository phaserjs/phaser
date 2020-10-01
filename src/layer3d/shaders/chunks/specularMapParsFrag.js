module.exports = [
    '#ifdef USE_SPECULARMAP',
    '',
    '	uniform sampler2D specularMap;',
    '',
    '#endif'
].join('\n');
