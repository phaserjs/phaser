module.exports = {
    vert: [
        'uniform mat4 u_view_matrix;',
        'attribute vec2 a_position;',
        'attribute vec2 a_tex_coord;',
        'attribute vec3 a_color;',
        'attribute float a_alpha;',
        'varying vec2 v_tex_coord;',
        'varying vec3 v_color;',
        'varying float v_alpha;',
        'void main () {',
        '   gl_Position = u_view_matrix * vec4(a_position, 1.0, 1.0);',
        '   v_tex_coord = a_tex_coord;',
        '   v_color = a_color;',
        '   v_alpha = a_alpha;',
        '}'
    ].join('\n'),
    frag: [
        'precision mediump float;',
        'uniform sampler2D u_sampler2D;',
        'varying vec2 v_tex_coord;',
        'varying vec3 v_color;',
        'varying float v_alpha;',
        'void main() {',
        '   gl_FragColor = texture2D(u_sampler2D, v_tex_coord) * vec4(v_color, v_alpha);',
        '}'
    ].join('\n')
};
