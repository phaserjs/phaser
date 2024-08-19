module.exports = [
    'uniform sampler2D uMainSampler[TEXTURE_COUNT];',
    'vec4 getTexture ()',
    '{',
    '    float texId = outTexDatum;',
    '    #pragma phaserTemplate(texIdProcess)',
    '    vec2 texCoord = outTexCoord;',
    '    #pragma phaserTemplate(texCoordProcess)',
    '    vec4 texture = vec4(0.0);',
    '    #pragma phaserTemplate(texSamplerProcess)',
    '    return texture;',
    '}',
].join('\n');
