/**
* Original shader from http://glsl.heroku.com/e#4122.10
* Tweaked, uniforms added and converted to Phaser/PIXI by Richard Davey
*/
Phaser.Filter.LightBeam = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1 };
    this.uniforms.thickness = { type: '1f', value: 70.0 };
    this.uniforms.speed = { type: '1f', value: 1.0 };
    this.uniforms.red = { type: '1f', value: 2.0 };
    this.uniforms.green = { type: '1f', value: 1.0 };
    this.uniforms.blue = { type: '1f', value: 1.0 };

    this.fragmentSrc = [

        "precision mediump float;",
        "uniform vec2      resolution;",
        "uniform float     time;",
        "uniform float     alpha;",
        "uniform float     thickness;",
        "uniform float     speed;",
        "uniform float     red;",
        "uniform float     green;",
        "uniform float     blue;",

        "void main(void) {",

            "vec2 uPos = (gl_FragCoord.xy / resolution.xy);",

            "uPos.y -= 0.50;",

            "float vertColor = 0.0;",

            "for (float i = 0.0; i < 1.0; i++)",
            "{",
                "float t = time * (i + speed);",
                "uPos.y += sin(uPos.x + t) * 0.2;",
                "float fTemp = abs(1.0 / uPos.y / thickness);",
                "vertColor += fTemp;",
            "}",

            "vec4 color = vec4(vertColor * red, vertColor * green, vertColor * blue, alpha);",
            "gl_FragColor = color;",
        "}"
    ];

};

Phaser.Filter.LightBeam.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.LightBeam.prototype.constructor = Phaser.Filter.LightBeam;

Phaser.Filter.LightBeam.prototype.init = function (width, height) {

    this.setResolution(width, height);

};

Object.defineProperty(Phaser.Filter.LightBeam.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

Object.defineProperty(Phaser.Filter.LightBeam.prototype, 'red', {

    get: function() {
        return this.uniforms.red.value;
    },

    set: function(value) {
        this.uniforms.red.value = value;
    }

});

Object.defineProperty(Phaser.Filter.LightBeam.prototype, 'green', {

    get: function() {
        return this.uniforms.green.value;
    },

    set: function(value) {
        this.uniforms.green.value = value;
    }

});

Object.defineProperty(Phaser.Filter.LightBeam.prototype, 'blue', {

    get: function() {
        return this.uniforms.blue.value;
    },

    set: function(value) {
        this.uniforms.blue.value = value;
    }

});

Object.defineProperty(Phaser.Filter.LightBeam.prototype, 'thickness', {

    get: function() {
        return this.uniforms.thickness.value;
    },

    set: function(value) {
        this.uniforms.thickness.value = value;
    }

});

Object.defineProperty(Phaser.Filter.LightBeam.prototype, 'speed', {

    get: function() {
        return this.uniforms.speed.value;
    },

    set: function(value) {
        this.uniforms.speed.value = value;
    }

});
