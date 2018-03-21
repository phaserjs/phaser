/**
* Original shader from http://glsl.heroku.com/e#9213.0
* Tweaked, uniforms added and converted to Phaser/PIXI by Richard Davey
*/
Phaser.Filter.Marble = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 };

    // Drives speed, higher number will make it slower.
    this.uniforms.fluid_speed = { type: '1f', value: 10.0 };

    this.uniforms.color_intensity = { type: '1f', value: 0.30 };

    //  The fragment shader source
    this.fragmentSrc = [

        "precision mediump float;",
        "uniform vec2      resolution;",
        "uniform float     time;",
        "uniform vec2      mouse;",
        "uniform float     alpha;",
        "uniform float     fluid_speed;",
        "uniform float     color_intensity;",

        "const int   complexity      = 40;    // More points of color.",
        "const float mouse_factor    = 25.0;  // Makes it more/less jumpy.",
        "const float mouse_offset    = 5.0;   // Drives complexity in the amount of curls/cuves.  Zero is a single whirlpool.",

        "const float Pi = 3.14159;",

        "float sinApprox(float x) {",
            "x = Pi + (2.0 * Pi) * floor(x / (2.0 * Pi)) - x;",
            "return (4.0 / Pi) * x - (4.0 / Pi / Pi) * x * abs(x);",
        "}",

        "float cosApprox(float x) {",
            "return sinApprox(x + 0.5 * Pi);",
        "}",

        "void main()",
        "{",
            "vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);",
            "for(int i=1;i<complexity;i++)",
            "{",
                "vec2 newp=p;",
                "newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed+0.3*float(i))+mouse.y/mouse_factor+mouse_offset;",
                "newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10))-mouse.x/mouse_factor+mouse_offset;",
                "p=newp;",
            "}",
            "vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity,color_intensity*sin(3.0*p.y)+color_intensity,color_intensity*sin(p.x+p.y)+color_intensity);",
            "gl_FragColor=vec4(col, alpha);",
        "}"
    ];

};

Phaser.Filter.Marble.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Marble.prototype.constructor = Phaser.Filter.Marble;

Phaser.Filter.Marble.prototype.init = function (width, height, speed, intensity) {

    this.setResolution(width, height);

    if (typeof speed === 'undefined') { speed = 10.0; }
    if (typeof intensity === 'undefined') { intensity = 0.30; }

    this.uniforms.fluid_speed.value = speed;
    this.uniforms.color_intensity.value = intensity;

};

Object.defineProperty(Phaser.Filter.Marble.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Marble.prototype, 'speed', {

    get: function() {
        return this.uniforms.fluid_speed.value;
    },

    set: function(value) {
        this.uniforms.fluid_speed.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Marble.prototype, 'intensity', {

    get: function() {
        return this.uniforms.color_intensity.value;
    },

    set: function(value) {
        this.uniforms.color_intensity.value = value;
    }

});
