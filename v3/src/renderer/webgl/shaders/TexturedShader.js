module.exports = {
    vert: [
        'uniform mat4 u_view_matrix;',
        'attribute vec2 a_position;',
        'attribute vec2 a_tex_coord;',
        'varying vec2 v_tex_coord;',
        'void main(void) {',
        '   gl_Position = u_view_matrix * vec4(a_position, 0.0, 1.0);',
        '   v_tex_coord = a_tex_coord;',
        '}'
    ].join('\n'),
    frag: [
        'precision mediump float;',
        'uniform sampler2D u_sampler;',
        'varying vec2 v_tex_coord;',
        'void main(void) {',
        '   gl_FragColor = texture2D(u_sampler, v_tex_coord);',
        '}'
    ].join('\n')
};
