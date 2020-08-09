module.exports = [
    '#define SHADER_NAME PHASER_DEFERRED_DIFFUSE_VS',
    '',
    'precision mediump float;',
    '',
    'attribute vec2 inPosition;',
    '',
    'void main()',
    '{',
    '    gl_Position = vec4(inPosition, 0.0, 1.0);',
    '}',
    ''
].join('\n');
