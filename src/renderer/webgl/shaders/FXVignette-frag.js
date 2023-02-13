module.exports = [
    '#define SHADER_NAME VIGNETTE_FS',
    '',
    'precision mediump float;',
    '',
    'uniform sampler2D uMainSampler;',
    'uniform float strength;',
    '',
    'varying vec2 outTexCoord;',
    '',
    'void main()',
    '{',
    '    vec2 uv = vec2(outTexCoord + vec2(-0.5, -0.5)) * 2.0;',
    '',
    '    gl_FragColor = texture2D(uMainSampler, outTexCoord) - length(uv * strength);',
    '}',
    ''
].join('\n');
