module.exports = [
    'vec2 clampTexCoordWithinFrame (vec2 texCoord)',
    '{',
    '    vec2 texRes = getTexRes();',
    '    vec4 frameTexel = outFrame * texRes.xyxy;',
    '    vec2 frameMin = frameTexel.xy + vec2(0.5, 0.5);',
    '    vec2 frameMax = frameTexel.xy + frameTexel.zw - vec2(0.5, 0.5);',
    '    return clamp(texCoord, frameMin / texRes, frameMax / texRes);',
    '}',
].join('\n');
