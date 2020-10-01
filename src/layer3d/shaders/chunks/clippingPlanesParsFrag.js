module.exports = [
    '#if NUM_CLIPPING_PLANES > 0',
    '    uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];',
    '#endif'
].join('\n');
