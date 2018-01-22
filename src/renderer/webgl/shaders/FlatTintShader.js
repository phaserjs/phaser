module.exports = {
    vert: [
        '#define SHADER_NAME PHASER_FLAT_TINT_VS',

        'precision mediump float;',
        
        'uniform mat4 uOrthoMatrix;',
        
        'attribute vec2 inPosition;',
        'attribute vec4 inTint;',
        
        'varying vec4 outTint;',
        
        'void main () {',
        '   gl_Position = uOrthoMatrix * vec4(inPosition, 1.0, 1.0);',
        '   outTint = inTint;',
        '}'
    
    ].join('\n'),
    frag: [
        '#define SHADER_NAME PHASER_FLAT_TINT_FS',
        
        'precision mediump float;',

        'varying vec4 outTint;',

        'void main() {',
        '   gl_FragColor = vec4(outTint.bgr * outTint.a, outTint.a);',
        '}'
    
    ].join('\n')
};
