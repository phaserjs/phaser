module.exports = [
    '#if !defined(USE_TANGENT) || defined(FLAT_SHADED)',
    '    #include <tsn>',
    '#endif',
    'uniform sampler2D normalMap;'
].join('\n');
