module.exports = [
    '#define SHADER_NAME PHASER_GRAPHICS_FS',
    '',
    'precision mediump float;',
    '',
    'varying vec4 outColor;',
    '',
    'void main ()',
    '{',
    '    gl_FragColor = vec4(outColor.bgr * outColor.a, outColor.a);',
    '}',
    ''
].join('\n');
