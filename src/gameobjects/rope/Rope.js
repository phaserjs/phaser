/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var PIPELINE_CONST = require('../../renderer/webgl/pipelines/const');
var RopeRender = require('./RopeRender');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Rope Game Object.
 *
 * The Rope object is WebGL only and does not have a Canvas counterpart.
 *
 * A Rope is a special kind of Game Object that has a texture that repeats along its entire length.
 * Unlike a Sprite, it isn't restricted to using just a quad and can have as many vertices as you define
 * when creating it. The vertices can be arranged in a horizontal or vertical strip and have their own
 * color and alpha values as well.
 *
 * A Ropes origin is always 0.5 x 0.5 and cannot be changed.
 *
 * @class Rope
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.23.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {string} [texture] - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager. If not given, `__DEFAULT` is used.
 * @param {(string|number|null)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {(number|Phaser.Types.Math.Vector2Like[])} [points=2] - An array containing the vertices data for this Rope, or a number that indicates how many segments to split the texture frame into. If none is provided a simple quad is created. See `setPoints` to set this post-creation.
 * @param {boolean} [horizontal=true] - Should the vertices of this Rope be aligned horizontally (`true`), or vertically (`false`)?
 * @param {number[]} [colors] - An optional array containing the color data for this Rope. You should provide one color value per pair of vertices.
 * @param {number[]} [alphas] - An optional array containing the alpha data for this Rope. You should provide one alpha value per pair of vertices.
 */
var Rope = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
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

    function Rope (scene, x, y, texture, frame, points, horizontal, colors, alphas)
    {
        if (texture === undefined) { texture = '__DEFAULT'; }
        if (points === undefined) { points = 2; }
        if (horizontal === undefined) { horizontal = true; }

        GameObject.call(this, scene, 'Rope');

        /**
         * The Animation State of this Rope.
         *
         * @name Phaser.GameObjects.Rope#anims
         * @type {Phaser.Animations.AnimationState}
         * @since 3.23.0
         */
        this.anims = new AnimationState(this);

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
         * @type {Phaser.Types.Math.Vector2Like[]}
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
         * The tint fill mode.
         *
        * `false` = An additive tint (the default), where vertices colors are blended with the texture.
        * `true` = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
         *
         * @name Phaser.GameObjects.Rope#tintFill
         * @type {boolean}
         * @since 3.23.0
         */
        this.tintFill = (texture === '__DEFAULT') ? true : false;

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
         * Are the Rope vertices aligned horizontally, in a strip, or vertically, in a column?
         *
         * This property is set during instantiation and cannot be changed directly.
         * See the `setVertical` and `setHorizontal` methods.
         *
         * @name Phaser.GameObjects.Rope#horizontal
         * @type {boolean}
         * @readonly
         * @since 3.23.0
         */
        this.horizontal = horizontal;

        /**
         * The horizontally flipped state of the Game Object.
         *
         * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
         * Flipping always takes place from the middle of the texture and does not impact the scale value.
         * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
         *
         * @name Phaser.GameObjects.Rope#_flipX
         * @type {boolean}
         * @default false
         * @private
         * @since 3.23.0
         */
        this._flipX = false;

        /**
         * The vertically flipped state of the Game Object.
         *
         * A Game Object that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
         * Flipping always takes place from the middle of the texture and does not impact the scale value.
         * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
         *
         * @name Phaser.GameObjects.Rope#_flipY
         * @type {boolean}
         * @default false
         * @private
         * @since 3.23.0
         */
        this._flipY = false;

        /**
         * Internal Vector2 used for vertices updates.
         *
         * @name Phaser.GameObjects.Rope#_perp
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.23.0
         */
        this._perp = new Vector2();

        /**
         * You can optionally choose to render the vertices of this Rope to a Graphics instance.
         *
         * Achieve this by setting the `debugCallback` and the `debugGraphic` properties.
         *
         * You can do this in a single call via the `Rope.setDebug` method, which will use the
         * built-in debug function. You can also set it to your own callback. The callback
         * will be invoked _once per render_ and sent the following parameters:
         *
         * `debugCallback(src, meshLength, verts)`
         *
         * `src` is the Rope instance being debugged.
         * `meshLength` is the number of mesh vertices in total.
         * `verts` is an array of the translated vertex coordinates.
         *
         * To disable rendering, set this property back to `null`.
         *
         * @name Phaser.GameObjects.Rope#debugCallback
         * @type {function}
         * @since 3.23.0
         */
        this.debugCallback = null;

        /**
         * The Graphics instance that the debug vertices will be drawn to, if `setDebug` has
         * been called.
         *
         * @name Phaser.GameObjects.Rope#debugGraphic
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.23.0
         */
        this.debugGraphic = null;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.initPipeline(PIPELINE_CONST.ROPE_PIPELINE);

        if (Array.isArray(points))
        {
            this.resizeArrays(points.length);
        }

        this.setPoints(points, colors, alphas);

        this.updateVertices();
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    /**
     * The Rope update loop.
     *
     * @method Phaser.GameObjects.Rope#preUpdate
     * @protected
     * @since 3.23.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        var prevFrame = this.anims.currentFrame;

        this.anims.update(time, delta);

        if (this.anims.currentFrame !== prevFrame)
        {
            this.updateUVs();
            this.updateVertices();
        }
    },

    /**
     * Start playing the given animation.
     *
     * @method Phaser.GameObjects.Rope#play
     * @since 3.23.0
     *
     * @param {string} key - The string-based key of the animation to play.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     * @param {number} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {this} This Game Object.
     */
    play: function (key, ignoreIfPlaying, startFrame)
    {
        this.anims.play(key, ignoreIfPlaying, startFrame);

        return this;
    },

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
     * Sets the alignment of the points in this Rope to be horizontal, in a strip format.
     *
     * Calling this method will reset this Rope. The current points, vertices, colors and alpha
     * values will be reset to thoes values given as parameters.
     *
     * @method Phaser.GameObjects.Rope#setHorizontal
     * @since 3.23.0
     *
     * @param {(number|Phaser.Types.Math.Vector2Like[])} [points] - An array containing the vertices data for this Rope, or a number that indicates how many segments to split the texture frame into. If none is provided the current points length is used.
     * @param {(number|number[])} [colors] - Either a single color value, or an array of values.
     * @param {(number|number[])} [alphas] - Either a single alpha value, or an array of values.
     *
     * @return {this} This Game Object instance.
     */
    setHorizontal: function (points, colors, alphas)
    {
        if (points === undefined) { points = this.points.length; }

        if (this.horizontal)
        {
            return this;
        }

        this.horizontal = true;

        return this.setPoints(points, colors, alphas);
    },

    /**
     * Sets the alignment of the points in this Rope to be vertical, in a column format.
     *
     * Calling this method will reset this Rope. The current points, vertices, colors and alpha
     * values will be reset to thoes values given as parameters.
     *
     * @method Phaser.GameObjects.Rope#setVertical
     * @since 3.23.0
     *
     * @param {(number|Phaser.Types.Math.Vector2Like[])} [points] - An array containing the vertices data for this Rope, or a number that indicates how many segments to split the texture frame into. If none is provided the current points length is used.
     * @param {(number|number[])} [colors] - Either a single color value, or an array of values.
     * @param {(number|number[])} [alphas] - Either a single alpha value, or an array of values.
     *
     * @return {this} This Game Object instance.
     */
    setVertical: function (points, colors, alphas)
    {
        if (points === undefined) { points = this.points.length; }

        if (!this.horizontal)
        {
            return this;
        }

        this.horizontal = false;

        return this.setPoints(points, colors, alphas);
    },

    /**
     * Sets the tint fill mode.
     *
     * Mode 0 (`false`) is an additive tint, the default, which blends the vertices colors with the texture.
     * This mode respects the texture alpha.
     *
     * Mode 1 (`true`) is a fill tint. Unlike an additive tint, a fill-tint literally replaces the pixel colors
     * from the texture with those in the tint. You can use this for effects such as making a player flash 'white'
     * if hit by something. This mode respects the texture alpha.
     *
     * See the `setColors` method for details of how to color each of the vertices.
     *
     * @method Phaser.GameObjects.Rope#setTintFill
     * @webglOnly
     * @since 3.23.0
     *
     * @param {boolean} [value=false] - Set to `false` for an Additive tint or `true` fill tint with alpha.
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
     * Note this method is called `setAlphas` (plural) and not `setAlpha`.
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
     * * One single numeric value: `setColors(0xff0000)` - This will set a single color tint for the whole Rope.
     * * An array of values: `setColors([ 0xff0000, 0x00ff00, 0x0000ff ])`
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
     * Or, you can provide an integer to do the same thing:
     *
     * ```javascript
     * rope.setPoints(4);
     * ```
     *
     * Which will divide the Rope into 4 equally sized segments based on the frame width.
     *
     * Note that calling this method with a different number of points than the Rope has currently will
     * _reset_ the color and alpha values, unless you provide them as arguments to this method.
     *
     * @method Phaser.GameObjects.Rope#setPoints
     * @since 3.23.0
     *
     * @param {(number|Phaser.Types.Math.Vector2Like[])} [points=2] - An array containing the vertices data for this Rope, or a number that indicates how many segments to split the texture frame into. If none is provided a simple quad is created.
     * @param {(number|number[])} [colors] - Either a single color value, or an array of values.
     * @param {(number|number[])} [alphas] - Either a single alpha value, or an array of values.
     *
     * @return {this} This Game Object instance.
     */
    setPoints: function (points, colors, alphas)
    {
        if (points === undefined) { points = 2; }

        if (typeof points === 'number')
        {
            //  Generate an array based on the points
            var segments = points;

            if (segments < 2)
            {
                segments = 2;
            }

            points = [];

            var s;
            var frameSegment;
            var offset;

            if (this.horizontal)
            {
                offset = -(this.frame.halfWidth);
                frameSegment = this.frame.width / (segments - 1);

                for (s = 0; s < segments; s++)
                {
                    points.push({ x: offset + s * frameSegment, y: 0 });
                }
            }
            else
            {
                offset = -(this.frame.halfHeight);
                frameSegment = this.frame.height / (segments - 1);

                for (s = 0; s < segments; s++)
                {
                    points.push({ x: 0, y: offset + s * frameSegment });
                }
            }
        }

        var total = points.length;
        var currentTotal = this.points.length;

        if (total < 1)
        {
            console.warn('Rope: Not enough points given');

            return this;
        }
        else if (total === 1)
        {
            points.unshift({ x: 0, y: 0 });
            total++;
        }

        if (currentTotal !== total)
        {
            this.resizeArrays(total);
        }

        this.points = points;

        this.updateUVs();

        if (colors !== undefined && colors !== null)
        {
            this.setColors(colors);
        }

        if (alphas !== undefined && alphas !== null)
        {
            this.setAlphas(alphas);
        }

        return this;
    },

    /**
     * Updates all of the UVs based on the Rope.points and `flipX` and `flipY` settings.
     *
     * @method Phaser.GameObjects.Rope#updateUVs
     * @since 3.23.0
     *
     * @return {this} This Game Object instance.
     */
    updateUVs: function ()
    {
        var currentUVs = this.uv;
        var total = this.points.length;

        var u0 = this.frame.u0;
        var v0 = this.frame.v0;
        var u1 = this.frame.u1;
        var v1 = this.frame.v1;

        var partH = (u1 - u0) / (total - 1);
        var partV = (v1 - v0) / (total - 1);

        for (var i = 0; i < total; i++)
        {
            var index = i * 4;

            var uv0;
            var uv1;
            var uv2;
            var uv3;

            if (this.horizontal)
            {
                if (this._flipX)
                {
                    uv0 = u1 - (i * partH);
                    uv2 = u1 - (i * partH);
                }
                else
                {
                    uv0 = u0 + (i * partH);
                    uv2 = u0 + (i * partH);
                }

                if (this._flipY)
                {
                    uv1 = v1;
                    uv3 = v0;
                }
                else
                {
                    uv1 = v0;
                    uv3 = v1;
                }
            }
            else
            {
                if (this._flipX)
                {
                    uv0 = u0;
                    uv2 = u1;
                }
                else
                {
                    uv0 = u1;
                    uv2 = u0;
                }

                if (this._flipY)
                {
                    uv1 = v1 - (i * partV);
                    uv3 = v1 - (i * partV);
                }
                else
                {
                    uv1 = v0 + (i * partV);
                    uv3 = v0 + (i * partV);
                }
            }

            currentUVs[index + 0] = uv0;
            currentUVs[index + 1] = uv1;
            currentUVs[index + 2] = uv2;
            currentUVs[index + 3] = uv3;
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
     * @param {number} newSize - The amount of segments to split the Rope in to.
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

        var nextPoint;
        var lastPoint = points[0];

        var frameSize = (this.horizontal) ? this.frame.halfHeight : this.frame.halfWidth;

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

            var perpLength = perp.length();

            perp.x /= perpLength;
            perp.y /= perpLength;

            perp.x *= frameSize;
            perp.y *= frameSize;

            vertices[index] = point.x + perp.x;
            vertices[index + 1] = point.y + perp.y;
            vertices[index + 2] = point.x - perp.x;
            vertices[index + 3] = point.y - perp.y;

            lastPoint = point;
        }

        return this;
    },

    /**
     * This method enables rendering of the Rope vertices to the given Graphics instance.
     *
     * If you enable this feature, you **must** call `Graphics.clear()` in your Scene `update`,
     * otherwise the Graphics instance you provide to debug will fill-up with draw calls,
     * eventually crashing the browser. This is not done automatically to allow you to debug
     * draw multiple Rope objects to a single Graphics instance.
     *
     * The Rope class has a built-in debug rendering callback `Rope.renderDebugVerts`, however
     * you can also provide your own callback to be used instead. Do this by setting the `callback` parameter.
     *
     * The callback is invoked _once per render_ and sent the following parameters:
     *
     * `callback(src, meshLength, verts)`
     *
     * `src` is the Rope instance being debugged.
     * `meshLength` is the number of mesh vertices in total.
     * `verts` is an array of the translated vertex coordinates.
     *
     * If using your own callback you do not have to provide a Graphics instance to this method.
     *
     * To disable debug rendering, to either your own callback or the built-in one, call this method
     * with no arguments.
     *
     * @method Phaser.GameObjects.Rope#setDebug
     * @since 3.23.0
     *
     * @param {Phaser.GameObjects.Graphics} [graphic] - The Graphic instance to render to if using the built-in callback.
     * @param {function} [callback] - The callback to invoke during debug render. Leave as undefined to use the built-in callback.
     *
     * @return {this} This Game Object instance.
     */
    setDebug: function (graphic, callback)
    {
        this.debugGraphic = graphic;

        if (!graphic && !callback)
        {
            this.debugCallback = null;
        }
        else if (!callback)
        {
            this.debugCallback = this.renderDebugVerts;
        }
        else
        {
            this.debugCallback = callback;
        }

        return this;
    },

    /**
     * The built-in Rope vertices debug rendering method.
     *
     * See `Rope.setDebug` for more details.
     *
     * @method Phaser.GameObjects.Rope#renderDebugVerts
     * @since 3.23.0
     *
     * @param {Phaser.GameObjects.Rope} src - The Rope object being rendered.
     * @param {number} meshLength - The number of vertices in the mesh.
     * @param {number[]} verts - An array of translated vertex coordinates.
     */
    renderDebugVerts: function (src, meshLength, verts)
    {
        var graphic = src.debugGraphic;

        var px0 = verts[0];
        var py0 = verts[1];
        var px1 = verts[2];
        var py1 = verts[3];

        graphic.lineBetween(px0, py0, px1, py1);

        for (var i = 4; i < meshLength; i += 4)
        {
            var x0 = verts[i + 0];
            var y0 = verts[i + 1];
            var x1 = verts[i + 2];
            var y1 = verts[i + 3];

            graphic.lineBetween(px0, py0, x0, y0);
            graphic.lineBetween(px1, py1, x1, y1);
            graphic.lineBetween(px1, py1, x0, y0);
            graphic.lineBetween(x0, y0, x1, y1);

            px0 = x0;
            py0 = y0;
            px1 = x1;
            py1 = y1;
        }
    },

    /**
     * Handles the pre-destroy step for the Rope, which removes the Animation component and typed arrays.
     *
     * @method Phaser.GameObjects.Rope#preDestroy
     * @private
     * @since 3.23.0
     */
    preDestroy: function ()
    {
        this.anims.destroy();

        this.anims = undefined;

        this.points = null;
        this.vertices = null;
        this.uv = null;
        this.colors = null;
        this.alphas = null;

        this.debugCallback = null;
        this.debugGraphic = null;
    },

    /**
     * The horizontally flipped state of the Game Object.
     *
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     *
     * @name Phaser.GameObjects.Rope#flipX
     * @type {boolean}
     * @default false
     * @since 3.23.0
     */
    flipX: {

        get: function ()
        {
            return this._flipX;
        },

        set: function (value)
        {
            this._flipX = value;

            return this.updateUVs();
        }

    },

    /**
     * The vertically flipped state of the Game Object.
     *
     * A Game Object that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     *
     * @name Phaser.GameObjects.Rope#flipY
     * @type {boolean}
     * @default false
     * @since 3.23.0
     */
    flipY: {

        get: function ()
        {
            return this._flipY;
        },

        set: function (value)
        {
            this._flipY = value;

            return this.updateUVs();
        }

    }

});

module.exports = Rope;
