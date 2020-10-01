module.exports = [
    '#if defined(USE_VCOLOR_RGB) || defined(USE_VCOLOR_RGBA)',
    '    v_Color = a_Color;',
    '#endif'
].join('\n');
