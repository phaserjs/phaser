/**
* Original shader by thygate@gmail.com, rotation and color mix modifications by malc (mlashley@gmail.com)
* Tweaked, uniforms added and converted to Phaser/PIXI by Richard Davey
*/
Phaser.Filter.ColorBars = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1 };
    // this.uniforms.origin = { type: '1f', value: 2.0 }

    this.fragmentSrc = [

        "// bars - thygate@gmail.com",
        "// rotation and color mix modifications by malc (mlashley@gmail.com)",
        "// modified by @hintz 2013-04-30",

        "precision mediump float;",

        "uniform vec3      resolution;",
        "uniform float     time;",
        "uniform float     alpha;",

        "vec2 position;",
        "vec4 color;",

        "float f = 6.0;",

        "float c = cos(time / 2.0);",
        "float s = sin(time / 2.0);",
        "mat2 R = mat2(c, -s, s, -c);",

        "//float barsize = 0.15;",
        "float barsize = 0.12;",
        "//float barsangle = 200.0 * sin(time * 0.001);",
        "float barsangle = 200.0 * cos(time * 0.001);",

        "vec4 bar(float pos, float r, float g, float b) {",
            "return max(0.0, 1.0 - abs(pos - position.y) / barsize) * vec4(r, g, b, 1.0);",
        "}",

        "void main(void)",
        "{",
            "position = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.xx;",
            "//position = 2.0 * position * R; // R = rotation",
            "position = 2.5 * position * R;",
            "//float t = time * 0.5; // 0.5 = spin speed",
            "float t = time * 0.5;",
            "vec4 color = vec4(0.0);",
            "color += bar(sin(t), 1.0, 0.0, 0.0);",
            "color += bar(sin(t + barsangle / f * 2.), 1.0, 0.5, 0.0);",
            "color += bar(sin(t + barsangle / f * 4.), 1.0, 1.0, 0.0);",
            "color += bar(sin(t + barsangle / f * 6.), 0.0, 1.0, 0.0);",
            "color += bar(sin(t + barsangle / f * 8.), 0.0, 1.0, 1.0);",
            "color += bar(sin(t + barsangle / f * 10.), 0.0, 0.0, 1.0);",
            "color += bar(sin(t + barsangle / f * 12.), 0.5, 0.0, 1.0);",
            "color += bar(sin(t + barsangle / f * 14.), 1.0, 0.0, 1.0);",
            "color.a = alpha;",
            "gl_FragColor = color;",
        "}"

    ];

};

Phaser.Filter.ColorBars.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.ColorBars.prototype.constructor = Phaser.Filter.ColorBars;

Phaser.Filter.ColorBars.prototype.init = function (width, height) {

    this.setResolution(width, height);

};

Object.defineProperty(Phaser.Filter.ColorBars.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

