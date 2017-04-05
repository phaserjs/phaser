module.exports = {
    vert: [
        'attribute vec2 a_position;',
        'attribute vec2 a_tex_coord;',
        'varying vec2 v_tex_coord;',
        'void main(void) {',
        '   gl_Position = vec4(a_position, 0.0, 1.0);',
        '   v_tex_coord = a_tex_coord;',
        '}'
    ].join('\n'),
    frag: [
        'precision mediump float;',
        'uniform sampler2D u_sampler;',
        'uniform float time;',
        'varying vec2 v_tex_coord;',
        'const float radius = 0.5;',
        'const float angle = 5.0;',
        'const vec2 offset = vec2(0.5, 0.5);',
        'void main(void) {',
        '   vec2 coord = v_tex_coord - offset;',
        '   float distance = length(coord);',
        '   if (distance < radius) {',
        '       float ratio = (radius - distance) / radius;',
        '       float angleMod = ratio * ratio * angle;',
        '       float s = sin(angleMod);',
        '       float c = cos(angleMod);',
        '       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);',
        '   }',
        '   gl_FragColor = texture2D(u_sampler, coord + offset);',
        '}'
    ].join('\n')
};
