module.exports = [
    'uniform sampler2D uMainSampler[TEXTURE_COUNT];',
    'vec4 getTexture (vec2 texCoord)',
    '{',
    '    #if TEXTURE_COUNT == 1',
    '    return texture2D(uMainSampler[0], texCoord);',
    '    #else',
    '    if (outTexDatum == 0.0) return texture2D(uMainSampler[0], texCoord);',
    '    #define ELSE_TEX_CASE(INDEX) else if (outTexDatum == float(INDEX)) return texture2D(uMainSampler[INDEX], texCoord);',
    '    #pragma phaserTemplate(texIdProcess)',
    '    else return vec4(0.0, 0.0, 0.0, 0.0);',
    '    #endif',
    '}'
].join('\n');
