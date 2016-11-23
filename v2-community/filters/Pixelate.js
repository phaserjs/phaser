/**
* Original author of PixelateFilter: Mat Groves http://matgroves.com/ @Doormat23
* adapted for Phaser.js
*/

/**
* This filter applies a pixelate effect making display objects appear 'blocky'.
* @class PixelateFilter
* @constructor
*/
Phaser.Filter.Pixelate = function(game) {

    Phaser.Filter.call(this, game);

    this.uniforms.invert = { type: '1f', value: 0 };
    this.uniforms.pixelSize = { type: '2f', value: { x: 1.0, y: 1.0 } };
    this.uniforms.dimensions = { type: '2f', value: { x: 1000.0, y: 1000.0 } };

    this.fragmentSrc = [

        "precision mediump float;",
        "varying vec2 vTextureCoord;",
        "uniform vec2 dimensions;",
        "uniform vec2 pixelSize;",
        "uniform sampler2D uSampler;",

        "void main(void)",
        "{",

            "vec2 coord = vTextureCoord;",
            "vec2 size = dimensions.xy/pixelSize;",
            "vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;",
            "gl_FragColor = texture2D(uSampler, color);",
        "}"
    ];
};

Phaser.Filter.Pixelate.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Pixelate.prototype.constructor = Phaser.Filter.Pixelate;

/**
* An object with visible x and y properties that are used to define the size of the filter effect per pixel.
* 
* @property size
* @type Phaser.Point
*/
Object.defineProperty(Phaser.Filter.Pixelate.prototype, 'size', {

    get: function() {

        return this.uniforms.pixelSize.value;

    },

    set: function(value) {

        this.dirty = true;
        this.uniforms.pixelSize.value = value;

    }

});

/**
* A value that defines the horizontal size of the filter effect per pixel.
* 
* @property sizeX
* @type number
*/
Object.defineProperty(Phaser.Filter.Pixelate.prototype, 'sizeX', {

    get: function() {

        return this.uniforms.pixelSize.value.x;

    },

    set: function(value) {

        this.dirty = true;
        this.uniforms.pixelSize.value.x = value;

    }

});

/**
* A value that defines the vertical size of the filter effect per pixel.
* 
* @property sizeY
* @type number
*/
Object.defineProperty(Phaser.Filter.Pixelate.prototype, 'sizeY', {

    get: function() {

        return this.uniforms.pixelSize.value.y;

    },

    set: function(value) {

        this.dirty = true;
        this.uniforms.pixelSize.value.y = value;

    }

});
