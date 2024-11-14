module.exports = [
    'vec4 boundedSampler(sampler2D sampler, vec2 uv)',
    '{',
    '    if (clamp(uv, 0.0, 1.0) != uv)',
    '    {',
    '        return vec4(0.0, 0.0, 0.0, 0.0);',
    '    }',
    '    return texture2D(sampler, uv);',
    '}',
].join('\n');
