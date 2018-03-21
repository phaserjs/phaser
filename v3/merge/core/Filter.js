/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is a base Filter class to use for any Phaser filter development.
* If you want to make a custom filter, this should be your base class.
*
* The default uniforms, types and values for all Filters are:
*
* ```
* resolution: { type: '2f', value: { x: 256, y: 256 }}
* time: { type: '1f', value: 0 }
* mouse: { type: '2f', value: { x: 0.0, y: 0.0 } }
* date: { type: '4fv', value: [ d.getFullYear(),  d.getMonth(),  d.getDate(), d.getHours() *60 * 60 + d.getMinutes() * 60 + d.getSeconds() ] }
* sampleRate: { type: '1f', value: 44100.0 }
* iChannel0: { type: 'sampler2D', value: null, textureData: { repeat: true } }
* iChannel1: { type: 'sampler2D', value: null, textureData: { repeat: true } }
* iChannel2: { type: 'sampler2D', value: null, textureData: { repeat: true } }
* iChannel3: { type: 'sampler2D', value: null, textureData: { repeat: true } }
* ```
*
* The vast majority of filters (including all of those that ship with Phaser) use fragment shaders, and
* therefore only work in WebGL and are not supported by Canvas at all.
*
* @class Phaser.Filter
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {object} [uniforms] - Uniform mappings object. The uniforms are added on the default uniforms, or replace them if the keys are the same.
* @param {Array|string} [fragmentSrc] - The fragment shader code. Either an array, one element per line of code, or a string.
*/
Phaser.Filter = function (game, uniforms, fragmentSrc)
{
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
    this.passes = [ this ];

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
    * @property {Phaser.Point} prevPoint - The previous position of the pointer (we don't update the uniform if the same)
    */
    this.prevPoint = new Phaser.Point();

    /*
    * The supported types are: 1f, 1fv, 1i, 2f, 2fv, 2i, 2iv, 3f, 3fv, 3i, 3iv, 4f, 4fv, 4i, 4iv, mat2, mat3, mat4 and sampler2D.
    */

    var d = new Date();

    /**
    * @property {object} uniforms - Default uniform mappings. Compatible with ShaderToy and GLSLSandbox.
    */
    this.uniforms = {

        resolution: { type: '2f', value: { x: 256, y: 256 }},
        time: { type: '1f', value: 0 },
        mouse: { type: '2f', value: { x: 0.0, y: 0.0 } },
        date: { type: '4fv', value: [ d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds() ] },
        sampleRate: { type: '1f', value: 44100.0 },
        iChannel0: { type: 'sampler2D', value: null, textureData: { repeat: true } },
        iChannel1: { type: 'sampler2D', value: null, textureData: { repeat: true } },
        iChannel2: { type: 'sampler2D', value: null, textureData: { repeat: true } },
        iChannel3: { type: 'sampler2D', value: null, textureData: { repeat: true } }

    };

    //  Copy over / replace any passed in the constructor
    if (uniforms)
    {
        for (var key in uniforms)
        {
            this.uniforms[key] = uniforms[key];
        }
    }

    //  If fragmentSrc is a string, split it based on new-lines into an array
    if (typeof fragmentSrc === 'string')
    {
        fragmentSrc = fragmentSrc.split('\n');
    }

    /**
    * @property {array|string} fragmentSrc - The fragment shader code.
    */
    this.fragmentSrc = fragmentSrc || [];

};

Phaser.Filter.prototype = {

    /**
    * This should be over-ridden. Will receive a variable number of arguments.
    *
    * @method Phaser.Filter#init
    */
    init: function ()
    {

        //  This should be over-ridden. Will receive a variable number of arguments.

    },

    /**
    * Set the resolution uniforms on the filter.
    * 
    * @method Phaser.Filter#setResolution
    * @param {number} width - The width of the display.
    * @param {number} height - The height of the display.
    */
    setResolution: function (width, height)
    {
        this.uniforms.resolution.value.x = width;
        this.uniforms.resolution.value.y = height;
    },

    /**
    * Updates the filter.
    *
    * @method Phaser.Filter#update
    * @param {Phaser.Pointer} [pointer] - A Pointer object to use for the filter. The coordinates are mapped to the mouse uniform.
    */
    update: function (pointer)
    {
        if (pointer)
        {
            var x = pointer.x / this.game.width;
            var y = 1 - pointer.y / this.game.height;

            if (x !== this.prevPoint.x || y !== this.prevPoint.y)
            {
                this.uniforms.mouse.value.x = x.toFixed(2);
                this.uniforms.mouse.value.y = y.toFixed(2);
                this.prevPoint.set(x, y);
            }
        }

        this.uniforms.time.value = this.game.time.totalElapsedSeconds();
    },

    /**
    * Creates a new Phaser.Image object using a blank texture and assigns
    * this Filter to it. The image is then added to the world.
    *
    * If you don't provide width and height values then Filter.width and Filter.height are used.
    *
    * If you do provide width and height values then this filter will be resized to match those
    * values.
    *
    * @method Phaser.Filter#addToWorld
    * @param {number} [x=0] - The x coordinate to place the Image at.
    * @param {number} [y=0] - The y coordinate to place the Image at.
    * @param {number} [width] - The width of the Image. If not specified (or null) it will use Filter.width. If specified Filter.width will be set to this value.
    * @param {number} [height] - The height of the Image. If not specified (or null) it will use Filter.height. If specified Filter.height will be set to this value.
    * @param {number} [anchorX=0] - Set the x anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
    * @param {number} [anchorY=0] - Set the y anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
    * @return {Phaser.Image} The newly added Image object.
    */
    addToWorld: function (x, y, width, height, anchorX, anchorY)
    {
        if (anchorX === undefined) { anchorX = 0; }
        if (anchorY === undefined) { anchorY = 0; }

        if (width !== undefined && width !== null)
        {
            this.width = width;
        }
        else
        {
            width = this.width;
        }

        if (height !== undefined && height !== null)
        {
            this.height = height;
        }
        else
        {
            height = this.height;
        }

        var image = this.game.add.image(x, y, '__default');

        image.width = width;
        image.height = height;

        image.anchor.set(anchorX, anchorY);

        image.filters = [ this ];

        return image;

    },

    /**
    * Syncs the uniforms between the class object and the shaders.
    * 
    * @method Phaser.Filter#syncUniforms
    */
    syncUniforms: function ()
    {
        for (var i = 0; i < this.shaders.length; i++)
        {
            this.shaders[i].dirty = true;
        }
    },

    /**
    * Clear down this Filter and null out references to game.
    *
    * @method Phaser.Filter#destroy
    */
    destroy: function ()
    {
        this.passes.length = 0;
        this.shaders.length = 0;
        this.fragmentSrc.length = 0;

        this.game = null;
        this.uniforms = null;
        this.prevPoint = null;
    }

};

Phaser.Filter.prototype.constructor = Phaser.Filter;

/**
* @name Phaser.Filter#width
* @property {number} width - The width (resolution uniform)
*/
Object.defineProperty(Phaser.Filter.prototype, 'width', {

    get: function () {

        return this.uniforms.resolution.value.x;

    },

    set: function (value) {

        this.uniforms.resolution.value.x = value;

    }

});

/**
* @name Phaser.Filter#height
* @property {number} height - The height (resolution uniform)
*/
Object.defineProperty(Phaser.Filter.prototype, 'height', {

    get: function () {

        return this.uniforms.resolution.value.y;

    },

    set: function (value) {

        this.uniforms.resolution.value.y = value;

    }

});
