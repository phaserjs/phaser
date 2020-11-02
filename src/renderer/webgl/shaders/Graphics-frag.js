module.exports = [
    '#define SHADER_NAME PHASER_GRAPHICS_FS',
    '',
    'precision mediump float;',
    '',
    'uniform sampler2D uMainSampler;',
    '',
    'varying vec2 outTexCoord;',
    'varying float outTintEffect;',
    'varying vec4 outTint;',
    '',
    'void main()',
    '{',
    '    vec4 color = vec4(outTint.bgr * outTint.a, outTint.a);',
    '',
    '    gl_FragColor = color;',
    '}',
    ''
].join('\n');
