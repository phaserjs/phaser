module.exports = {
    vert: [
    'precision mediump float;',
    'attribute vec2 a_position;',
    'void main()',
    '{',
    '   gl_Position = vec4(a_position, 0.0, 1.0);',
    '}',
    ''
    ].join('\n'),
    frag: [
    'precision mediump float;',
    'uniform vec2 u_resolution;',
    'uniform sampler2D u_main_sampler;',
    'uniform sampler2D u_mask_sampler;',
    'void main()',
    '{',
    '   vec2 uv = gl_FragCoord.xy / u_resolution;',
    '   vec4 main_color = texture2D(u_main_sampler, uv);',
    '   vec4 mask_color = texture2D(u_mask_sampler, uv);',
    '   float alpha = mask_color.a * main_color.a;',
    '   // Just mask using alpha channel',
    '   gl_FragColor = vec4(main_color.rgb * alpha, alpha);',
    '}'
    ].join('\n')
};
