module.exports = {
    vert: [
    'precision mediump float;',
    'attribute vec2 a_position;',
    'attribute vec2 a_tex_coord;',
    'varying vec2 v_tex_coord;',
    'void main()',
    '{',
    '   gl_Position = vec4(a_position, 0.0, 1.0);',
    '    v_tex_coord = a_tex_coord;',
    '}',
    ''
    ].join('\n'),
    frag: [
    'precision mediump float;',
    'uniform sampler2D u_main_sampler;',
    'uniform sampler2D u_mask_sampler;',
    'varying vec2 out_texcoord;',
    'void main()',
    '{',
    '    vec4 main_color = texture2D(u_main_sampler, out_texcoord);',
    '    vec4 mask_color = texture2D(u_mask_sampler, out_texcoord);',
    '    // Just mask using alpha channel',
    '    gl_FragColor = vec4(main_color.rgb, mask_color.a);',
    '}'
    ].join('\n')
};
