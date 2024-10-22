module.exports = [
    '#pragma phaserTemplate(shaderName)',
    'precision mediump float;',
    'uniform sampler2D uMainSampler;',
    'uniform sampler2D uMaskSampler;',
    'uniform bool invert;',
    'varying vec2 outTexCoord;',
    'void main ()',
    '{',
    '    vec4 color = texture2D(uMainSampler, outTexCoord);',
    '    vec4 mask = texture2D(uMaskSampler, outTexCoord);',
    '    float a = mask.a;',
    '    color *= invert ? (1.0 - a) : a;',
    '    gl_FragColor = color;',
    '}'
].join('\n');
