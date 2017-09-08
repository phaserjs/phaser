var GBufferShader = function ()
{
    var frag = [
        '#extension GL_EXT_draw_buffers : require',

        'precision mediump float;',

        'uniform sampler2D uMainTexture;',
        'uniform sampler2D uNormTexture;',

        'varying vec2 v_tex_coord;',
        'varying vec3 v_color;',
        'varying float v_alpha;',

        'void main()',
        '{',
        '    vec4 spriteColor = texture2D(uMainTexture, v_tex_coord) * vec4(v_color, v_alpha);',
        '    vec3 spriteNormal = texture2D(uNormTexture, v_tex_coord).rgb;',
            
        '    gl_FragData[0] = spriteColor;',
        '    gl_FragData[1] = vec4(spriteNormal, spriteColor.a);',
        '}'
    ];

    return frag.join('\n');
};

module.exports = GBufferShader;
