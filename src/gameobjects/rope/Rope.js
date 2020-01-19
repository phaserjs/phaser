/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var RopeRender = require('./RopeRender');
var NOOP = require('../../utils/NOOP');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Rope Game Object.
 *
 * @class Rope
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.23.0
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer|null)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {Phaser.Types.Math.Vector2Like[]} [points] - An array containing the vertices data for this Rope. If none is provided a simple quad is created. See `setPoints` to set this post-creation.
 * @param {number[]} [colors] - An optional array containing the color data for this Rope. You should provide one color value per pair of vertices.
 * @param {number[]} [alphas] - An optional array containing the alpha data for this Rope. You should provide one alpha value per pair of vertices.
 */
var Rope = new Class({

    Extends: GameObject,

    Mixins: [
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        RopeRender
    ],

    initialize:

    function Rope (scene, x, y, texture, frame, points, colors, alphas)
    {
        if (points === undefined)
        {
            points = [ { x: 0, y: 0 } ];
        }

        GameObject.call(this, scene, 'Rope');

        /**
         * An array containing the points data for this Rope.
         * 
         * Each point should be given as a Vector2Like object (i.e. a Vector2, Geom.Point or object with public x/y properties).
         * 
         * The point coordinates are given in local space, where 0 x 0 is the start of the Rope strip.
         * 
         * You can modify the contents of this array directly in real-time to create interesting effects.
         * If you do so, be sure to call `setDirty` _after_ modifying this array, so that the vertices data is
         * updated before the next render. Alternatively, you can use the `setPoints` method instead.
         * 
         * Should you need to change the _size_ of this array, then you should always use the `setPoints` method.
         *
         * @name Phaser.GameObjects.Rope#points
         * @type {Phaser.Math.Types.Vector2Like[]}
         * @since 3.23.0
         */
        this.points = points;

        /**
         * An array containing the vertices data for this Rope.
         * 
         * This data is calculated automatically in the `updateVertices` method, based on the points provided.
         *
         * @name Phaser.GameObjects.Rope#vertices
         * @type {Float32Array}
         * @since 3.23.0
         */
        this.vertices;

        /**
         * An array containing the uv data for this Rope.
         * 
         * This data is calculated automatically in the `setPoints` method, based on the points provided.
         *
         * @name Phaser.GameObjects.Rope#uv
         * @type {Float32Array}
         * @since 3.23.0
         */
        this.uv;

        /**
         * An array containing the color data for this Rope.
         * 
         * Colors should be given as numeric RGB values, such as 0xff0000.
         * You should provide _two_ color values for every point in the Rope, one for the top and one for the bottom of each quad.
         * 
         * You can modify the contents of this array directly in real-time, however, should you need to change the _size_
         * of the array, then you should use the `setColors` method instead.
         *
         * @name Phaser.GameObjects.Rope#colors
         * @type {Uint32Array}
         * @since 3.23.0
         */
        this.colors;

        /**
         * An array containing the alpha data for this Rope.
         * 
         * Alphas should be given as float values, such as 0.5.
         * You should provide _two_ alpha values for every point in the Rope, one for the top and one for the bottom of each quad.
         * 
         * You can modify the contents of this array directly in real-time, however, should you need to change the _size_
         * of the array, then you should use the `setAlphas` method instead.
         *
         * @name Phaser.GameObjects.Rope#alphas
         * @type {Float32Array}
         * @since 3.23.0
         */
        this.alphas;

        /**
         * Fill or additive mode used when blending the color values?
         * 
         * @name Phaser.GameObjects.Rope#tintFill
         * @type {boolean}
         * @default false
         * @since 3.23.0
         */
        this.tintFill = false;

        /**
         * If the Rope is marked as `dirty` it will automatically recalculate its vertices
         * the next time it renders. You can also force this by calling `updateVertices`.
         * 
         * @name Phaser.GameObjects.Rope#dirty
         * @type {boolean}
         * @since 3.23.0
         */
        this.dirty = false;

        /**
         * Internal Vector2 used for vertices updates.
         * 
         * @name Phaser.GameObjects.Rope#_perp
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.23.0
         */
        this._perp = new Vector2();

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.initPipeline('TextureTintStripPipeline');

        this.resizeArrays(points.length);

        this.setPoints(points, colors, alphas);

        this.updateVertices();
    },

    /**
     * This method is left intentionally empty and does not do anything.
     * It is retained to allow a Rope to be added to a Container.
     * You should modify the alphas array values instead. See `setAlphas`.
     * 
     * @method Phaser.GameObjects.Rope#setAlpha
     * @since 3.23.0
     */
    setAlpha: NOOP,

    /**
     * Flags this Rope as being dirty. A dirty rope will recalculate all of its vertices data
     * the _next_ time it renders. You should set this rope as dirty if you update the points
     * array directly.
     * 
     * @method Phaser.GameObjects.Rope#setDirty
     * @since 3.23.0
     * 
     * @return {this} This Game Object instance.
     */
    setDirty: function ()
    {
        this.dirty = true;

        return this;
    },

    /**
     * Swap this Game Object from using a fill-tint to an additive tint.
     * 
     * Unlike an additive tint, a fill-tint literally replaces the pixel colors from the texture
     * with those in the tint. You can use this for effects such as making a player flash 'white'
     * if hit by something. See the `setColors` method for details of tinting the vertices.
     *
     * @method Phaser.GameObjects.Rope#setTintFill
     * @webglOnly
     * @since 3.23.0
     *
     * @param {boolean} [value=false] - Use tint fill (`true`) or an additive tint (`false`)
     * 
     * @return {this} This Game Object instance.
     */
    setTintFill: function (value)
    {
        if (value === undefined) { value = false; }

        this.tintFill = value;

        return this;
    },

    /**
     * Set the alpha values used by the Rope during rendering.
     * 
     * You can provide the values in a number of ways:
     * 
     * 1) One single numeric value: `setAlphas(0.5)` - This will set a single alpha for the whole Rope.
     * 2) Two numeric value: `setAlphas(1, 0.5)` - This will set a 'top' and 'bottom' alpha value across the whole Rope.
     * 3) An array of values: `setAlphas([ 1, 0.5, 0.2 ])`
     * 
     * If you provide an array of values and the array has exactly the same number of values as `points` in the Rope, it
     * will use each alpha value per rope segment.
     * 
     * If the provided array has a different number of values than `points` then it will use the values in order, from
     * the first Rope segment and on, until it runs out of values. This allows you to control the alpha values at all
     * vertices in the Rope.
     * 
     * Note this method is called `setAlphas` (plural) and not `setAlpha`, which is a NOOP.
     * 
     * @method Phaser.GameObjects.Rope#setAlphas
     * @since 3.23.0
     * 
     * @param {(number|number[])} [alphas] - Either a single alpha value, or an array of values. If nothing is provided alpha is reset to 1.
     * @param {number} [bottomAlpha] - An optional bottom alpha value. See the method description for details.
     * 
     * @return {this} This Game Object instance.
     */
    setAlphas: function (alphas, bottomAlpha)
    {
        var total = this.points.length;

        if (total < 1)
        {
            return this;
        }

        var currentAlphas = this.alphas;

        if (alphas === undefined)
        {
            alphas = [ 1 ];
        }
        else if (!Array.isArray(alphas) && bottomAlpha === undefined)
        {
            alphas = [ alphas ];
        }

        var i;
        var index = 0;

        if (bottomAlpha !== undefined)
        {
            //  Top / Bottom alpha pair
            for (i = 0; i < total; i++)
            {
                index = i * 2;

                currentAlphas[index] = alphas;
                currentAlphas[index + 1] = bottomAlpha;
            }
        }
        else if (alphas.length === total)
        {
            //  If there are exactly the same number of alphas as points, we'll combine the alphas
            for (i = 0; i < total; i++)
            {
                index = i * 2;

                currentAlphas[index] = alphas[i];
                currentAlphas[index + 1] = alphas[i];
            }
        }
        else
        {
            var prevAlpha = alphas[0];

            for (i = 0; i < total; i++)
            {
                index = i * 2;
    
                if (alphas.length > index)
                {
                    prevAlpha = alphas[index];
                }

                currentAlphas[index] = prevAlpha;

                if (alphas.length > index + 1)
                {
                    prevAlpha = alphas[index + 1];
                }

                currentAlphas[index + 1] = prevAlpha;
            }
        }

        return this;

    },

    /**
     * Set the color values used by the Rope during rendering.
     * 
     * Colors are used to control the level of tint applied across the Rope texture.
     * 
     * You can provide the values in a number of ways:
     * 
     * 1) One single numeric value: `setColors(0xff0000)` - This will set a single color tint for the whole Rope.
     * 3) An array of values: `setColors([ 0xff0000, 0x00ff00, 0x0000ff ])`
     * 
     * If you provide an array of values and the array has exactly the same number of values as `points` in the Rope, it
     * will use each color per rope segment.
     * 
     * If the provided array has a different number of values than `points` then it will use the values in order, from
     * the first Rope segment and on, until it runs out of values. This allows you to control the color values at all
     * vertices in the Rope.
     * 
     * @method Phaser.GameObjects.Rope#setColors
     * @since 3.23.0
     * 
     * @param {(number|number[])} [colors] - Either a single color value, or an array of values. If nothing is provided color is reset to 0xffffff.
     * 
     * @return {this} This Game Object instance.
     */
    setColors: function (colors)
    {
        var total = this.points.length;

        if (total < 1)
        {
            return this;
        }

        var currentColors = this.colors;

        if (colors === undefined)
        {
            colors = [ 0xffffff ];
        }
        else if (!Array.isArray(colors))
        {
            colors = [ colors ];
        }

        var i;
        var index = 0;

        if (colors.length === total)
        {
            //  If there are exactly the same number of colors as points, we'll combine the colors
            for (i = 0; i < total; i++)
            {
                index = i * 2;

                currentColors[index] = colors[i];
                currentColors[index + 1] = colors[i];
            }
        }
        else
        {
            var prevColor = colors[0];

            for (i = 0; i < total; i++)
            {
                index = i * 2;
    
                if (colors.length > index)
                {
                    prevColor = colors[index];
                }

                currentColors[index] = prevColor;

                if (colors.length > index + 1)
                {
                    prevColor = colors[index + 1];
                }

                currentColors[index + 1] = prevColor;
            }
        }

        return this;
    },

    /**
     * Sets the points used by this Rope.
     * 
     * The points should be provided as an array of Vector2, or vector2-like objects (i.e. those with public x/y properties).
     * 
     * Each point corresponds to one segment of the Rope. The more points in the array, the more segments the rope has.
     * 
     * Point coordinates are given in local-space, not world-space, and are directly related to the size of the texture
     * this Rope object is using.
     * 
     * For example, a Rope using a 512 px wide texture, split into 4 segments (128px each) would use the following points:
     * 
     * ```javascript
     * rope.setPoints([
     *   { x: 0, y: 0 },
     *   { x: 128, y: 0 },
     *   { x: 256, y: 0 },
     *   { x: 384, y: 0 }
     * ]);
     * ```
     * 
     * Note that calling this method with a different number of points than the Rope has currently will
     * _reset_ the color and alpha values, unless you provide them as arguments to this method.
     * 
     * See also `Rope.split`.
     * 
     * @method Phaser.GameObjects.Rope#setPoints
     * @since 3.23.0
     * 
     * @param {Phaser.Math.Types.Vector2Like[]} [points] - An array of points to split the Rope into.
     * @param {(number|number[])} [colors] - Either a single color value, or an array of values.
     * @param {(number|number[])} [alphas] - Either a single alpha value, or an array of values.
     * 
     * @return {this} This Game Object instance.
     */
    setPoints: function (points, colors, alphas)
    {
        var total = points.length;

        if (total < 1)
        {
            return this;
        }

        var currentUVs = this.uv;

        if (this.points.length !== total)
        {
            this.resizeArrays(total);
        }

        var index = 0;
        var amount = 0;
    
        for (var i = 0; i < total; i++)
        {
            index = i * 4;
            amount = i / (total - 1);
    
            currentUVs[index] = amount;
            currentUVs[index + 1] = 0;
            currentUVs[index + 2] = amount;
            currentUVs[index + 3] = 1;
        }

        this.points = points;

        if (colors !== undefined)
        {
            this.setColors(colors);
        }

        if (alphas !== undefined)
        {
            this.setAlphas(alphas);
        }

        return this;
    },

    /**
     * Resizes all of the internal arrays: `vertices`, `uv`, `colors` and `alphas` to the new
     * given Rope segment total.
     * 
     * @method Phaser.GameObjects.Rope#resizeArrays
     * @since 3.23.0
     * 
     * @param {integer} newSize - The amount of segments to split the Rope in to.
     * 
     * @return {this} This Game Object instance.
     */
    resizeArrays: function (newSize)
    {
        var colors = this.colors;
        var alphas = this.alphas;

        this.vertices = new Float32Array(newSize * 4);
        this.uv = new Float32Array(newSize * 4);

        colors = new Uint32Array(newSize * 2);
        alphas = new Float32Array(newSize * 2);

        for (var i = 0; i < newSize * 2; i++)
        {
            colors[i] = 0xffffff;
            alphas[i] = 1;
        }

        this.colors = colors;
        this.alphas = alphas;

        //  updateVertices during next render
        this.dirty = true;

        return this;
    },

    /**
     * Updates the vertices based on the Rope points.
     * 
     * This method is called automatically during rendering if `Rope.dirty` is `true`, which is set
     * by the `setPoints` and `setDirty` methods. You should flag the Rope as being dirty if you modify
     * the Rope points directly.
     * 
     * @method Phaser.GameObjects.Rope#updateVertices
     * @since 3.23.0
     * 
     * @return {this} This Game Object instance.
     */
    updateVertices: function ()
    {
        var perp = this._perp;
        var points = this.points;
        var vertices = this.vertices;

        var total = points.length;

        this.dirty = false;

        if (total < 1)
        {
            return;
        }

        var lastPoint = points[0];
        var nextPoint;
    
        for (var i = 0; i < total; i++)
        {
            var point = points[i];
            var index = i * 4;
    
            if (i < total - 1)
            {
                nextPoint = points[i + 1];
            }
            else
            {
                nextPoint = point;
            }
    
            perp.x = nextPoint.y - lastPoint.y;
            perp.y = -(nextPoint.x - lastPoint.x);
    
            var ratio = (1 - (i / (total - 1))) * 10;
    
            if (ratio > 1)
            {
                ratio = 1;
            }
    
            var perpLength = perp.length();
            var num = this.frame.halfHeight;

            perp.x /= perpLength;
            perp.y /= perpLength;
    
            perp.x *= num;
            perp.y *= num;
    
            vertices[index] = point.x + perp.x;
            vertices[index + 1] = point.y + perp.y;
            vertices[index + 2] = point.x - perp.x;
            vertices[index + 3] = point.y - perp.y;
    
            lastPoint = point;
        }

        return this;
    }

});

module.exports = Rope;
