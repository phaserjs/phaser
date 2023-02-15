module.exports = [
    '#define SHADER_NAME PHASER_QUAD_VS',
    'precision mediump float;',
    'attribute vec2 inPosition;',
    'attribute vec2 inTexCoord;',
    'varying vec2 outFragCoord;',
    'varying vec2 outTexCoord;',
    'void main ()',
    '{',
    '    outFragCoord = inPosition.xy * 0.5 + 0.5;',
    '    outTexCoord = inTexCoord;',
    '    gl_Position = vec4(inPosition, 0, 1);',
    '}',
].join('\n');
