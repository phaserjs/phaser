module.exports = [
    'vec2 v2len (vec2 a, vec2 b)',
    '{',
    '    return sqrt(a*a+b*b);',
    '}',
    'vec2 getBlockyTexCoord (vec2 texCoord, vec2 texRes) {',
    '    texCoord *= texRes;',
    '    vec2 seam = floor(texCoord + 0.5);',
    '    texCoord = (texCoord - seam) / v2len(dFdx(texCoord), dFdy(texCoord)) + seam;',
    '    texCoord = clamp(texCoord, seam-.5, seam+.5);',
    '    return texCoord / texRes;',
    '}',
].join('\n');
