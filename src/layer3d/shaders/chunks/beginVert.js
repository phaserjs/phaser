module.exports = [
    'vec3 transformed = vec3(a_Position);',
    'vec3 objectNormal = vec3(a_Normal);',
    '#ifdef USE_TANGENT',
    '    vec3 objectTangent = vec3(a_Tangent.xyz);',
    '#endif'
].join('\n');
