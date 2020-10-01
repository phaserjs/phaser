module.exports = [
    '#ifdef USE_VCOLOR_RGB',
    '    varying vec3 v_Color;',
    '#endif',
    '#ifdef USE_VCOLOR_RGBA',
    '    varying vec4 v_Color;',
    '#endif'
].join('\n');
