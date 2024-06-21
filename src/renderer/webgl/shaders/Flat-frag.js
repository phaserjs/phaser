module.exports = [
    '#define SHADER_NAME PHASER_FLAT_FS',
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'varying vec4 outTint;',
    'void main ()',
    '{',
    '    gl_FragColor = outTint;',
    '}',
].join('\n');
