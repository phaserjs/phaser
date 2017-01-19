module.exports = [
    'precision lowp float;',
    'uniform sampler2D u_sampler2D;',
    'varying vec2 v_tex_coord;',
    'void main() {',
    '   gl_FragColor = texture2D(u_sampler2D, v_tex_coord);',
    '}'
].join('\n');
