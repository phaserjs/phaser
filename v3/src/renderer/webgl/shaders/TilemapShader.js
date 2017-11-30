module.exports = {
    vert: [
    'precision mediump float;',
    '',
    'uniform mat4 u_view_matrix;',
    'uniform mat3 u_camera_matrix;',
    'uniform vec2 u_scroll;',
    'uniform vec2 u_scroll_factor;',
    'uniform vec2 u_tilemap_position;',
    '',
    'attribute vec2 a_position;',
    'attribute vec2 a_tex_coord;',
    'varying vec2 v_tex_coord;',
    '',
    'void main()',
    '{',
    '    vec2 position = u_tilemap_position + a_position;',
    '    ',
    '    position = position - (u_scroll * u_scroll_factor);',
    '    position = (u_camera_matrix * vec3(position, 1.0)).xy;',
    '    ',
    '    gl_Position = u_view_matrix * vec4(position, 1.0, 1.0);',
    '    v_tex_coord = a_tex_coord;',
    '}',
    ''
    ].join('\n'),
    frag: [
    'precision mediump float;',
    'uniform sampler2D u_sampler2D;',
    'varying vec2 v_tex_coord;',
    'void main()',
    '{',
    '    vec4 output_color = texture2D(u_sampler2D, v_tex_coord);',
    '    gl_FragColor = vec4(output_color.rgb * output_color.a, output_color.a);',
    '}'
    ].join('\n')
};
