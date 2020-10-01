module.exports = [
    '#ifdef USE_ALPHA_MAP',
    '',
    '	uniform sampler2D alphaMap;',
    '',
    '#endif'
].join('\n');
