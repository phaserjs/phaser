module.exports = [
    '#pragma phaserTemplate(shaderName)',
    'precision mediump float;',
    'uniform sampler2D uMainSampler;',
    'uniform vec2 resolution;',
    'uniform vec4 uSizeAndOffset;',
    'varying vec2 outTexCoord;',
    'void main()',
    '{',
    '    vec2 gridCell = floor((outTexCoord * resolution + uSizeAndOffset.zw) / uSizeAndOffset.xy) * uSizeAndOffset.xy - uSizeAndOffset.zw;',
    '    vec2 texCoord = gridCell / resolution;',
    '    gl_FragColor = texture2D(uMainSampler, texCoord);',
    '}',
].join('\n');
