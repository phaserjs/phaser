module.exports = [
    '#ifdef USE_SHADOW',
    '    // outColor *= getShadowMask();',
    '#endif'
].join('\n');
