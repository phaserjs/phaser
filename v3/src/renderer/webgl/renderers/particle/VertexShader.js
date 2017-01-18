module.exports = [
    'uniform mat4 u_view_matrix;',
    'attribute vec2 a_position;',
    'attribute vec2 a_tex_coord;',
    'varying vec2 v_tex_coord;',
    'void main () {',
    '   gl_Position = u_view_matrix * vec4(a_position, 1.0, 1.0);',
    '   v_tex_coord = a_tex_coord;',
    '}'
].join('\n');
