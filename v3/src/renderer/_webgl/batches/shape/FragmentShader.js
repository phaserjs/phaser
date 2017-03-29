module.exports = [
    'precision mediump float;',
    'varying vec4 v_color;',
    'varying float v_alpha;',
    'void main() {',
    '   gl_FragColor = vec4(v_color.bgr, v_alpha);',
    '}'
].join('\n');
