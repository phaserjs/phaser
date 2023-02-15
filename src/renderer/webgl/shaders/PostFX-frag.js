module.exports = [
    '#define SHADER_NAME PHASER_POSTFX_FS',
    'precision mediump float;',
    'uniform sampler2D uMainSampler;',
    'varying vec2 outTexCoord;',
    'void main ()',
    '{',
    '    gl_FragColor = texture2D(uMainSampler, outTexCoord);',
    '}',
].join('\n');
