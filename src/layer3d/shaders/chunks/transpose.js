module.exports = [
    'mat4 transposeMat4(mat4 inMatrix) {',
    '    vec4 i0 = inMatrix[0];',
    '    vec4 i1 = inMatrix[1];',
    '    vec4 i2 = inMatrix[2];',
    '    vec4 i3 = inMatrix[3];',
    '    mat4 outMatrix = mat4(',
    '        vec4(i0.x, i1.x, i2.x, i3.x),',
    '        vec4(i0.y, i1.y, i2.y, i3.y),',
    '        vec4(i0.z, i1.z, i2.z, i3.z),',
    '        vec4(i0.w, i1.w, i2.w, i3.w)',
    '    );',
    '    return outMatrix;',
    '}'
].join('\n');
