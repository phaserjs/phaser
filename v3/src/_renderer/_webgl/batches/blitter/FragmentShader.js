module.exports = [
    'precision lowp float;',
    'uniform sampler2D u_sampler2D;',
    'varying vec2 v_tex_coord;',
    'varying float v_alpha;',
    'void main() {',
    '   gl_FragColor = texture2D(u_sampler2D, v_tex_coord) * vec4(1.0, 1.0, 1.0, v_alpha);',
    '}'
].join('\n');
