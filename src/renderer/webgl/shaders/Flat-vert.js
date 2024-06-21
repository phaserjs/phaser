module.exports = [
    '#define SHADER_NAME PHASER_FLAT_VS',
    'precision mediump float;',
    'uniform mat4 uProjectionMatrix;',
    'attribute vec2 inPosition;',
    'attribute vec4 inTint;',
    'varying vec4 outTint;',
    'void main ()',
    '{',
    '    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);',
    '    outTint = vec4(inTint.bgr * inTint.a, inTint.a);',
    '}',
].join('\n');
