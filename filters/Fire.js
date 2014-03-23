/**
* Original shader by @301z (http://glsl.heroku.com/e#11707.0)
* Tweaked, uniforms added and converted to Phaser/PIXI by Richard Davey
*/
Phaser.Filter.Fire = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 };
    this.uniforms.shift = { type: '1f', value: 1.6 };
    this.uniforms.speed = { type: '2f', value: { x: 0.7, y: 0.4 } };

    this.fragmentSrc = [

        "precision mediump float;",
        "uniform vec2      resolution;",
        "uniform float     time;",
        "uniform float     alpha;",
        "uniform vec2      speed;",
        "uniform float     shift;",

        "float rand(vec2 n) {",
            "return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);",
        "}",

        "float noise(vec2 n) {",
            "const vec2 d = vec2(0.0, 1.0);",
            "vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));",
            "return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);",
        "}",

        "float fbm(vec2 n) {",
            "float total = 0.0, amplitude = 1.0;",
            "for (int i = 0; i < 4; i++) {",
                "total += noise(n) * amplitude;",
                "n += n;",
                "amplitude *= 0.5;",
            "}",
            "return total;",
        "}",

        "void main() {",

            "const vec3 c1 = vec3(0.5, 0.0, 0.1);",
            "const vec3 c2 = vec3(0.9, 0.0, 0.0);",
            "const vec3 c3 = vec3(0.2, 0.0, 0.0);",
            "const vec3 c4 = vec3(1.0, 0.9, 0.0);",
            "const vec3 c5 = vec3(0.1);",
            "const vec3 c6 = vec3(0.9);",

            "vec2 p = gl_FragCoord.xy * 8.0 / resolution.xx;",
            "float q = fbm(p - time * 0.1);",
            "vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));",
            "vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);",
            "gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / resolution.y), alpha);",
        "}"
    ];

};

Phaser.Filter.Fire.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Fire.prototype.constructor = Phaser.Filter.Fire;

Phaser.Filter.Fire.prototype.init = function (width, height, alpha, shift) {

    this.setResolution(width, height);

    if (typeof alpha !== 'undefined') {
        this.uniforms.alpha.value = alpha;
    }

    if (typeof shift !== 'undefined') {
        this.uniforms.shift.value = shift;
    }

};

Object.defineProperty(Phaser.Filter.Fire.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Fire.prototype, 'shift', {

    get: function() {
        return this.uniforms.shift.value;
    },

    set: function(value) {
        this.uniforms.shift.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Fire.prototype, 'speed', {

    get: function() {
        return this.uniforms.speed.value;
    },

    set: function(value) {
        this.uniforms.speed.value = value;
    }

});
