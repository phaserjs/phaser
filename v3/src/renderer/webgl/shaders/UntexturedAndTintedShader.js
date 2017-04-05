module.exports = {
    vert: [
        'uniform mat4 u_view_matrix;',
        'attribute vec2 a_position;',
        'attribute vec4 a_color;',
        'varying vec4 v_color;',
        'void main () {',
        '   gl_Position = u_view_matrix * vec4(a_position, 1.0, 1.0);',
        '   v_color = a_color;',
        '}'
    ].join('\n'),
    frag:[
        'precision lowp float;',
        'varying vec4 v_color;',
        'void main() {',
        '   gl_FragColor = v_color;',
        '}'
    ].join('\n')
};
