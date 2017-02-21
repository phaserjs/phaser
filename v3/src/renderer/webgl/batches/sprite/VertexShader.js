module.exports = [
    'uniform mat4 u_view_matrix;',
    'attribute vec2 a_position;',
    'attribute vec2 a_tex_coord;',
    'attribute vec2 a_translate;',
    'attribute vec2 a_scale;',
    'attribute float a_rotation;',
    'attribute vec3 a_color;',
    'varying vec2 v_tex_coord;',
    'varying vec3 v_color;',
    'void main () {',
    '   float c = cos(a_rotation);',
    '   float s = sin(a_rotation);',
    '   vec2 t_position = vec2(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c);',
    '   gl_Position = u_view_matrix * vec4(t_position * a_scale + a_translate, 1.0, 1.0);',
    '   v_tex_coord = a_tex_coord;',
    '   v_color = a_color;',
    '}'
].join('\n');
