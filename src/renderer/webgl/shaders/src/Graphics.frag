#define SHADER_NAME PHASER_GRAPHICS_FS

precision mediump float;

uniform sampler2D uMainSampler;

varying vec2 outTexCoord;
varying float outTintEffect;
varying vec4 outTint;

// uniform vec2 repeat = vec2(2, 2);

void main()
{
    // pixel = v_colour * texture2D(t0, vec2(mod(tex_coords.x * repeat.x, 1), mod(tex_coords.y * repeat.y, 1)));

    vec4 color = vec4(outTint.bgr * outTint.a, outTint.a);

    gl_FragColor = color;
}
