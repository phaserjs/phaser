/**
* Original shader by TriggerHLM (https://www.shadertoy.com/view/MdXGDH)
* Tweaked, uniforms added and converted to Phaser/PIXI by Richard Davey
*/
Phaser.Filter.Plasma = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 };
    this.uniforms.size = { type: '1f', value: 0.03 };
    this.uniforms.redShift = { type: '1f', value: 0.5 };
    this.uniforms.greenShift = { type: '1f', value: 0.5 };
    this.uniforms.blueShift = { type: '1f', value: 0.9 };
        
    this.fragmentSrc = [

        "precision mediump float;",
        "uniform float     time;",
        "uniform float     alpha;",
        "uniform float     size;",
        "uniform float     redShift;",
        "uniform float     greenShift;",
        "uniform float     blueShift;",

        "const float PI = 3.14159265;",

        "float ptime = time * 0.1;",

        "void main(void) {",

            "float color1, color2, color;",

            "color1 = (sin(dot(gl_FragCoord.xy, vec2(sin(ptime * 3.0), cos(ptime * 3.0))) * 0.02 + ptime * 3.0) + 1.0) / 2.0;",
            "vec2 center = vec2(640.0 / 2.0, 360.0 / 2.0) + vec2(640.0 / 2.0 * sin(-ptime * 3.0), 360.0 / 2.0 * cos(-ptime * 3.0));",
            "color2 = (cos(length(gl_FragCoord.xy - center) * size) + 1.0) / 2.0;",
            "color = (color1 + color2) / 2.0;",

            "float red = (cos(PI * color / redShift + ptime * 3.0) + 1.0) / 2.0;",
            "float green = (sin(PI * color / greenShift + ptime * 3.0) + 1.0) / 2.0;",
            "float blue = (sin(PI * color / blueShift + ptime * 3.0) + 1.0) / 2.0;",

            "gl_FragColor = vec4(red, green, blue, alpha);",
        "}"
    ];

};

Phaser.Filter.Plasma.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Plasma.prototype.constructor = Phaser.Filter.Plasma;

Phaser.Filter.Plasma.prototype.init = function (width, height, alpha, size) {

    this.setResolution(width, height);

    if (typeof alpha !== 'undefined') { 
        this.uniforms.alpha.value = alpha;
    }

    if (typeof size !== 'undefined') { 
        this.uniforms.size.value = size;
    }

}

Object.defineProperty(Phaser.Filter.Plasma.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Plasma.prototype, 'size', {

    get: function() {
        return this.uniforms.size.value;
    },

    set: function(value) {
        this.uniforms.size.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Plasma.prototype, 'redShift', {

    get: function() {
        return this.uniforms.redShift.value;
    },

    set: function(value) {
        this.uniforms.redShift.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Plasma.prototype, 'greenShift', {

    get: function() {
        return this.uniforms.greenShift.value;
    },

    set: function(value) {
        this.uniforms.greenShift.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Plasma.prototype, 'blueShift', {

    get: function() {
        return this.uniforms.blueShift.value;
    },

    set: function(value) {
        this.uniforms.blueShift.value = value;
    }

});
