module.exports = [
    'uniform sampler2D uMainSampler;',
    'vec4 getTexture ()',
    '{',
    '    vec2 texCoord = outTexCoord;',
    '    #pragma phaserTemplate(texCoordProcess)',
    '    return texture2D(uMainSampler, texCoord);',
    '}',
].join('\n');
