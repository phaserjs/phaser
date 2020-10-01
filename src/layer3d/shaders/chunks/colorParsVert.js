module.exports = [
    '#ifdef USE_VCOLOR_RGB',
    '    attribute vec3 a_Color;',
    '    varying vec3 v_Color;',
    '#endif',
    '#ifdef USE_VCOLOR_RGBA',
    '    attribute vec4 a_Color;',
    '    varying vec4 v_Color;',
    '#endif'
].join('\n');
