/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Blur = require('../../filters/Blur');
var Bokeh = require('../../filters/Bokeh');
var Displacement = require('../../filters/Displacement');
var Mask = require('../../filters/Mask');
var Pixelate = require('../../filters/Pixelate');
var Sampler = require('../../filters/Sampler');

/**
 * @classdesc
 * A list of filters being applied to a {@link Phaser.Cameras.Scene2D.Camera}.
 *
 * Filters can apply special effects and masks.
 * They are only available in WebGL.
 * Use {@link Phaser.GameObjects.RenderFilters} to apply them to Game Objects.
 *
 * Filters include the following:
 *
 * * Barrel Distortion (not yet implemented in Technical Preview 5)
 * * Bloom (not yet implemented in Technical Preview 5)
 * * Blur
 * * Bokeh / Tilt Shift
 * * Circle Outline (not yet implemented in Technical Preview 5)
 * * Color Matrix (not yet implemented in Technical Preview 5)
 * * Glow (not yet implemented in Technical Preview 5)
 * * Displacement
 * * Gradient (not yet implemented in Technical Preview 5)
 * * Mask
 * * Pixelate
 * * Sampler
 * * Shine (not yet implemented in Technical Preview 5)
 * * Shadow (not yet implemented in Technical Preview 5)
 * * Vignette (not yet implemented in Technical Preview 5)
 * * Wipe / Reveal (not yet implemented in Technical Preview 5)
 *
 * This list is either 'internal' or 'external'.
 * Internal filters apply to things within the camera.
 * External filters apply to the camera itself, in its rendering context.
 * A complete list of rendering steps for a Camera goes:
 *
 * 1. Objects render to a texture the size of the camera.
 * 2. Internal filters draw that texture to new textures, applying effects. 
 *   These are usually the same size, but may expand to accommodate blur.
 * 3. The texture is drawn to a texture the size of the context where the camera
 *   will be drawn, accounting for transformation of the camera itself.
 * 4. External filters draw that texture to new textures,
 *   again applying effects and expanding where necessary.
 * 5. The final texture draws the filtered camera contents to the context.
 *
 * For example, consider a RenderFilters game object which is rotated 45 degrees.
 * Apply a horizontal blur filter.
 * If the filter is internal, the blur will appear at 45 degrees,
 * because it is applied before the object is rotated.
 * If the filter is external, the blur will appear horizontal,
 * because it is applied after the object is rotated.
 *
 * You should use internal filters wherever possible,
 * because they apply only to the region of the camera/game object.
 * External filters are full-screen and can be more expensive.
 * 
 * Filters can be stacked. The order of the list is the order of application.
 *
 * As you can appreciate, some effects are more expensive than others. For example, a bloom effect is going to be more
 * expensive than a simple color matrix effect, so please consider using them wisely and performance test your target
 * platforms early on in production.
 *
 * This FilterList is created internally and does not need to be instantiated directly.
 *
 * In Phaser 3, Filters were known as FX.
 *
 * @class FilterList
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.90.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this list.
 * @param {boolean} [isExternal=false] - Whether this list is for external use.
 */
var FilterList = new Class({
    initialize: function FilterList (camera, isExternal)
    {
        /**
         * The Camera that owns this list.
         *
         * @name Phaser.GameObjects.Components.FilterList#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 3.90.0
         */
        this.camera = camera;

        /**
         * The list of filters.
         *
         * This list can be manipulated directly.
         * If you want to add or remove filters,
         * please use the appropriate methods to ensure they are handled correctly.
         * Moving filters around in the list is safe.
         *
         * @name Phaser.GameObjects.Components.FilterList#list
         * @type {Phaser.Filters.Controller[]}
         * @default []
         * @since 3.90.0
         */
        this.list = [];

        /**
         * Whether this list is for external use.
         * External filters apply to the camera in context,
         * rather than things within the camera.
         *
         * @name Phaser.GameObjects.Components.FilterList#isExternal
         * @type {boolean}
         * @default false
         * @since 3.90.0
         */
        this.isExternal = !!isExternal;
    },

    /**
     * Destroys and removes all filters in this list.
     *
     * @method Phaser.GameObjects.Components.FilterList#clear
     * @since 3.90.0
     * @returns {this} This FilterList instance.
     */
    clear: function ()
    {
        for (var i = 0; i < this.list.length; i++)
        {
            this.list[i].destroy();
        }

        this.list.length = 0;

        return this;
    },

    /**
     * Adds a filter to this list.
     *
     * @method Phaser.GameObjects.Components.FilterList#add
     * @since 3.90.0
     *
     * @param {Phaser.Filters.Controller} filter - The filter to add.
     * @param {number} [index] - The index to insert the filter at. If not given, the filter is added to the end of the list. If negative, it is inserted from the end.
     *
     * @return {Phaser.Filters.Controller} The filter that was added.
     */
    add: function (filter, index)
    {
        if (index === undefined)
        {
            this.list.push(filter);
        }
        else
        {
            this.list.splice(index, 0, filter);
        }

        return filter;
    },

    /**
     * Removes a filter from this list, then destroys it.
     *
     * @method Phaser.GameObjects.Components.FilterList#remove
     * @since 3.90.0
     *
     * @param {Phaser.Filters.Controller} filter - The filter to remove.
     *
     * @return {this} This FilterList instance.
     */
    remove: function (filter)
    {
        var index = this.list.indexOf(filter);

        if (index !== -1)
        {
            this.list.splice(index, 1);
            filter.destroy();
        }

        return this;
    },

    /**
     * Adds a Blur effect.
     *
     * A Gaussian blur is the result of blurring an image by a Gaussian function. It is a widely used effect,
     * typically to reduce image noise and reduce detail. The visual effect of this blurring technique is a
     * smooth blur resembling that of viewing the image through a translucent screen, distinctly different
     * from the bokeh effect produced by an out-of-focus lens or the shadow of an object under usual illumination.
     *
     * @method Phaser.GameObjects.Components.FilterList#addBlur
     * @since 3.90.0
     *
     * @param {number} [quality=0] - The quality of the blur effect. Can be either 0 for Low Quality, 1 for Medium Quality or 2 for High Quality.
     * @param {number} [x=2] - The horizontal offset of the blur effect.
     * @param {number} [y=2] - The vertical offset of the blur effect.
     * @param {number} [strength=1] - The strength of the blur effect.
     * @param {number} [color=0xffffff] - The color of the blur, as a hex value.
     * @param {number} [steps=4] - The number of steps to run the blur effect for. This value should always be an integer.
     *
     * @return {Phaser.Filters.Blur} The new Blur filter controller.
     */
    addBlur: function (quality, x, y, strength, color, steps)
    {
        return this.add(new Blur(
            this.camera,
            quality,
            x,
            y,
            strength,
            color,
            steps
        ));
    },

    /**
     * Adds a Bokeh effect.
     *
     * Bokeh refers to a visual effect that mimics the photographic technique of creating a shallow depth of field.
     * This effect is used to emphasize the game's main subject or action, by blurring the background or foreground
     * elements, resulting in a more immersive and visually appealing experience. It is achieved through rendering
     * techniques that simulate the out-of-focus areas, giving a sense of depth and realism to the game's graphics.
     *
     * See also Tilt Shift.
     *
     * @method Phaser.GameObjects.Components.FilterList#addBokeh
     * @since 3.90.0
     *
     * @param {number} [radius=0.5] - The radius of the bokeh effect.
     * @param {number} [amount=1] - The amount of the bokeh effect.
     * @param {number} [contrast=0.2] - The color contrast of the bokeh effect.
     *
     * @return {Phaser.Filters.Bokeh} The new Bokeh filter controller.
     */
    addBokeh: function (radius, amount, contrast)
    {
        return this.add(new Bokeh(
            this.camera,
            radius,
            amount,
            contrast
        ));
    },

    /**
     * Adds a Displacement effect.
     *
     * The displacement effect is a visual technique that alters the position of pixels in an image
     * or texture based on the values of a displacement map. This effect is used to create the illusion
     * of depth, surface irregularities, or distortion in otherwise flat elements. It can be applied to
     * characters, objects, or backgrounds to enhance realism, convey movement, or achieve various
     * stylistic appearances.
     *
     * @method Phaser.GameObjects.Components.FilterList#addDisplacement
     * @since 3.90.0
     *
     * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
     * @param {number} [x=0.005] - The amount of horizontal displacement to apply. A very small float number, such as 0.005.
     * @param {number} [y=0.005] - The amount of vertical displacement to apply. A very small float number, such as 0.005.
     *
     * @return {Phaser.Filters.Displacement} The new Displacement filter controller.
     */
    addDisplacement: function (texture, x, y)
    {
        return this.add(new Displacement(
            this.camera,
            texture,
            x,
            y
        ));
    },

    /**
     * Adds a Mask effect.
     *
     * A mask uses a texture to hide parts of an input.
     * It multiplies the color and alpha of the input
     * by the alpha of the mask in the corresponding texel.
     *
     * Masks can be inverted, which switches what they hide and what they show.
     *
     * Masks can use either a texture or a GameObject.
     * If a GameObject is used, the mask will render the GameObject
     * to a DynamicTexture and use that.
     * The mask will automatically update when the GameObject changes,
     * unless the `autoUpdate` flag is set to `false`.
     *
     * When the mask filter is used as an internal filter,
     * the mask will match the object/view being filtered.
     * This is useful for creating effects that follow the object,
     * such as effects intended to match an animated sprite.
     *
     * When the mask filter is used as an external filter,
     * the mask will match the context of the camera.
     * This is useful for creating effects that cover the entire view.
     *
     * @method Phaser.GameObjects.Components.FilterList#addMask
     * @since 3.90.0
     *
     * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for the mask, which must exist in the Texture Manager.
     * @param {boolean} [invert=false] - Whether to invert the mask.
     *
     * @return {Phaser.Filters.Mask} The new Mask filter controller.
     */
    addMask: function (texture, invert)
    {
        return this.add(new Mask(
            this.camera,
            texture,
            invert
        ));
    },

    /**
     * Adds a Pixelate effect.
     *
     * The pixelate effect is a visual technique that deliberately reduces the resolution or detail of an image,
     * creating a blocky or mosaic appearance composed of large, visible pixels. This effect can be used for stylistic
     * purposes, as a homage to retro gaming, or as a means to obscure certain elements within the game, such as
     * during a transition or to censor specific content.
     *
     * @method Phaser.GameObjects.Components.FilterList#addPixelate
     * @since 3.90.0
     *
     * @param {number} [amount] - The amount of pixelation. A higher value creates a more pronounced effect.
     *
     * @return {Phaser.Filters.Pixelate} The new Pixelate filter controller.
     */
    addPixelate: function (amount)
    {
        return this.add(new Pixelate(
            this.camera,
            amount
        ));
    },

    /**
     * Adds a Sampler effect.
     *
     * This controller manages a sampler.
     * It doesn't actually render anything, and leaves the image unaltered.
     * It is used to sample a region of the camera view, and pass the results to a callback.
     * This is useful for extracting data from the camera view.
     *
     * This operation is expensive, so use sparingly.
     *
     * @method Phaser.GameObjects.Components.FilterList#addSampler
     * @since 3.90.0
     *
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The callback to call with the results of the sampler.
     * @param {null|Phaser.Types.Math.Vector2Like|Phaser.Geom.Rectangle} [region=null] - The region to sample. If `null`, the entire camera view is sampled. If a `Phaser.Types.Math.Vector2Like`, a point is sampled. If a `Phaser.Geom.Rectangle`, the region is sampled.
     *
     * @return {Phaser.Filters.Sampler} The new Sampler filter controller.
     */
    addSampler: function (callback, region)
    {
        return this.add(new Sampler(
            this.camera,
            callback,
            region
        ));
    },

    /**
     * Adds a Tilt Shift effect.
     *
     * This Bokeh effect can also be used to generate a Tilt Shift effect, which is a technique used to create a miniature
     * effect by blurring everything except a small area of the image. This effect is achieved by blurring the
     * top and bottom elements, while keeping the center area in focus.
     *
     * See also Bokeh.
     *
     * @method Phaser.GameObjects.Components.FilterList#addTiltShift
     * @since 3.90.0
     *
     * @param {number} [radius] - The radius of the bokeh effect.
     * @param {number} [amount] - The amount of the bokeh effect.
     * @param {number} [contrast] - The color contrast of the bokeh effect.
     * @param {number} [blurX] - The amount of horizontal blur.
     * @param {number} [blurY] - The amount of vertical blur.
     * @param {number} [strength] - The strength of the blur.
     *
     * @return {Phaser.Filters.Bokeh} The new Bokeh filter controller.
     */
    addTiltShift: function (radius, amount, contrast, blurX, blurY, strength)
    {
        return this.add(new Bokeh(
            this.camera,
            radius,
            amount,
            contrast,
            true,
            blurX,
            blurY,
            strength
        ));
    },

    /**
     * Destroys this FilterList.
     *
     * @method Phaser.GameObjects.Components.FilterList#destroy
     * @since 3.90.0
     */
    destroy: function ()
    {
        this.clear();

        this.camera = null;
    }
});

module.exports = FilterList;
