module.exports = [
    'gl_Position = u_Projection * u_View * u_Model * vec4(transformed, 1.0);'
].join('\n');
