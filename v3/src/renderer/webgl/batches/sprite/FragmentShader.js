module.exports = [
    'precision lowp float;',
    'uniform sampler2D u_sampler2D;',
    'varying vec2 v_tex_coord;',
    'varying vec3 v_color;',
    'void main() {',
    '   gl_FragColor = texture2D(u_sampler2D, v_tex_coord) * vec4(v_color, 1.0);',
    '}'
].join('\n');
