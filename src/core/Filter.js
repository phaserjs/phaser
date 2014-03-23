/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is a base Filter template to use for any Phaser filter development.
*
* @class Phaser.Filter
* @classdesc Phaser - Filter
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Object} uniforms - Uniform mappings object
* @param {Array} fragmentSrc - The fragment shader code.
*/
Phaser.Filter = function (game, uniforms, fragmentSrc) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {number} type - The const type of this object, either Phaser.WEBGL_FILTER or Phaser.CANVAS_FILTER.
    * @default
    */
    this.type = Phaser.WEBGL_FILTER;

    /**
    * An array of passes - some filters contain a few steps this array simply stores the steps in a linear fashion.
    * For example the blur filter has two passes blurX and blurY.
    * @property {array} passes - An array of filter objects.
    * @private
    */
    this.passes = [this];

    /**
    * @property {array} shaders - Array an array of shaders.
    * @private
    */
    this.shaders = [];

    /**
    * @property {boolean} dirty - Internal PIXI var.
    * @default
    */
    this.dirty = true;

    /**
    * @property {number} padding - Internal PIXI var.
    * @default
    */
    this.padding = 0;

    /**
    * @property {object} uniforms - Default uniform mappings.
    */
    this.uniforms = {

        time: { type: '1f', value: 0 },
        resolution: { type: '2f', value: { x: 256, y: 256 }},
        mouse: { type: '2f', value: { x: 0.0, y: 0.0 }}

    };

    /**
    * @property {array} fragmentSrc - The fragment shader code.
    */
    this.fragmentSrc = fragmentSrc || [];

};

Phaser.Filter.prototype = {

    /**
    * Should be over-ridden.
    * @method Phaser.Filter#init
    */
    init: function () {
        //  This should be over-ridden. Will receive a variable number of arguments.
    },

    /**
    * Set the resolution uniforms on the filter.
    * @method Phaser.Filter#setResolution
    * @param {number} width - The width of the display.
    * @param {number} height - The height of the display.
    */
    setResolution: function (width, height) {

        this.uniforms.resolution.value.x = width;
        this.uniforms.resolution.value.y = height;

    },

    /**
    * Updates the filter.
    * @method Phaser.Filter#update
    * @param {Phaser.Pointer} [pointer] - A Pointer object to use for the filter. The coordinates are mapped to the mouse uniform.
    */
    update: function (pointer) {

        if (typeof pointer !== 'undefined')
        {
            if (pointer.x > 0)
            {
                this.uniforms.mouse.x = pointer.x.toFixed(2);
            }

            if (pointer.y > 0)
            {
                this.uniforms.mouse.y = pointer.y.toFixed(2);
            }
        }

        this.uniforms.time.value = this.game.time.totalElapsedSeconds();

    },

    /**
    * Clear down this Filter and null out references
    * @method Phaser.Filter#destroy
    */
    destroy: function () {

        this.game = null;

    }

};

Phaser.Filter.prototype.constructor = Phaser.Filter;

/**
* @name Phaser.Filter#width
* @property {number} width - The width (resolution uniform)
*/
Object.defineProperty(Phaser.Filter.prototype, 'width', {

    get: function() {
        return this.uniforms.resolution.value.x;
    },

    set: function(value) {
        this.uniforms.resolution.value.x = value;
    }

});

/**
* @name Phaser.Filter#height
* @property {number} height - The height (resolution uniform)
*/
Object.defineProperty(Phaser.Filter.prototype, 'height', {

    get: function() {
        return this.uniforms.resolution.value.y;
    },

    set: function(value) {
        this.uniforms.resolution.value.y = value;
    }

});
