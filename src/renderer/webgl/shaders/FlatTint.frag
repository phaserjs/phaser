#define SHADER_NAME PHASER_FLAT_TINT_FS

precision mediump float;

varying vec4 outTint;

void main() {
    gl_FragColor = vec4(outTint.rgb * outTint.a, outTint.a);
}
