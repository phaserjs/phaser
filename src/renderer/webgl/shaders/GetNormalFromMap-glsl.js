module.exports = [
    'vec3 getNormalFromMap (vec2 texCoord)',
    '{',
    '    vec3 normalMap = texture2D(uNormSampler, texCoord).rgb;',
    '    return normalize(outInverseRotationMatrix * vec3(normalMap * 2.0 - 1.0));',
    '}',
].join('\n');
