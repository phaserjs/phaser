module.exports = {
    vert: [
        'precision mediump float;',
        'uniform mat4 u_view_matrix;',
        'attribute vec2 a_position;',
        'attribute vec4 a_color;',
        'attribute float a_alpha;',
        'varying vec4 v_color;',
        'varying float v_alpha;',
        'void main () {',
        '   gl_Position = u_view_matrix * vec4(a_position, 1.0, 1.0);',
        '   v_color = a_color;',
        '   v_alpha = a_alpha;',
        '}'
    ].join('\n'),
    frag: [
        'precision mediump float;',
        'varying vec4 v_color;',
        'varying float v_alpha;',
        'void main() {',
        '   gl_FragColor = vec4(v_color.bgr, v_alpha);',
        '}'
    ].join('\n')
};
