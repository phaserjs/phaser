var ParticleShader = function ()
{
    var vert = [
        'precision mediump float;',
        'uniform mat4 u_view_matrix;',

        'attribute vec2 a_position;',
        'attribute vec2 a_tex_coord;',
        'attribute vec4 a_color;',

        'varying vec4 v_color;',
        'varying vec2 v_tex_coord;',

        'void main()',
        '{',
        '    gl_Position = u_view_matrix * vec4(a_position, 1.0, 1.0);',

        '    v_color = a_color;',
        '    v_tex_coord = a_tex_coord;',
        '}'
    ];

    var frag = [
        'precision mediump float;',

        'uniform sampler2D u_main_sampler;',

        'varying vec4 v_color;',
        'varying vec2 v_tex_coord;',

        'void main()',
        '{',
        '    gl_FragColor = texture2D(u_main_sampler, v_tex_coord) * v_color;',
        '}'
    ];

    return {
        vert: vert.join('\n'),
        frag: frag.join('\n')
    };
};

module.exports = ParticleShader();
