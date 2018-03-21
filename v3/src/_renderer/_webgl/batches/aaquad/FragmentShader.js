module.exports = [
    'precision lowp float;',
    'varying vec4 v_color;',
    'void main() {',
    '   gl_FragColor = v_color;',
    '}'
].join('\n');
