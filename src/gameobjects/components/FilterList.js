/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Barrel = require('../../filters/Barrel');
var Blend = require('../../filters/Blend');
var Blur = require('../../filters/Blur');
var Bokeh = require('../../filters/Bokeh');
var ColorMatrix = require('../../filters/ColorMatrix');
var Displacement = require('../../filters/Displacement');
var Glow = require('../../filters/Glow');
var Mask = require('../../filters/Mask');
var ParallelFilters = null;
var Pixelate = require('../../filters/Pixelate');
var Sampler = require('../../filters/Sampler');
var Shadow = require('../../filters/Shadow');
var Threshold = require('../../filters/Threshold');

/**
 * @classdesc
 * A list of filters being applied to a {@link Phaser.Cameras.Scene2D.Camera}.
 *
 * Filters can apply special effects and masks.
 * They are only available in WebGL.
 * Use `gameObject.enableFilters()` to apply them to Game Objects.
 *
 * Filters include the following:
 *
 * * Barrel Distortion
 * * Blur
 * * Blend
 * * Bokeh / Tilt Shift
 * * Color Matrix
 * * Displacement
 * * Glow
 * * Mask
 * * Parallel Filters
 * * Pixelate
 * * Sampler
 * * Shadow
 * * Threshold
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
 * For example, consider a game object which is rotated 45 degrees.
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
 * @since 4.0.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this list.
 */
var FilterList = new Class({
    initialize: function FilterList (camera)
    {
        /**
         * The Camera that owns this list.
         *
         * @name Phaser.GameObjects.Components.FilterList#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 4.0.0
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
         * @since 4.0.0
         */
        this.list = [];
    },

    /**
     * Destroys and removes all filters in this list.
     *
     * @method Phaser.GameObjects.Components.FilterList#clear
     * @since 4.0.0
     * @returns {this} This FilterList instance.
     */
    clear: function ()
    {
        for (var i = 0; i < this.list.length; i++)
        {
            var filter = this.list[i];
            if (!filter.ignoreDestroy)
            {
                filter.destroy();
            }
        }

        this.list.length = 0;

        return this;
    },

    /**
     * Adds a filter to this list.
     *
     * @method Phaser.GameObjects.Components.FilterList#add
     * @since 4.0.0
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
     * @since 4.0.0
     *
     * @param {Phaser.Filters.Controller} filter - The filter to remove.
     * @param {boolean} [forceDestroy=false] - If `true`, the filter will be destroyed even if it has the `ignoreDestroy` flag set.
     *
     * @return {this} This FilterList instance.
     */
    remove: function (filter, forceDestroy)
    {
        var index = this.list.indexOf(filter);

        if (index !== -1)
        {
            this.list.splice(index, 1);
            if (!filter.ignoreDestroy || forceDestroy)
            {
                filter.destroy();
            }
        }

        return this;
    },

    /**
     * Returns all active filters in this list.
     *
     * @method Phaser.GameObjects.Components.FilterList#getActive
     * @since 4.0.0
     * @return {Phaser.Filters.Controller[]} The active filters in this list.
     */
    getActive: function ()
    {
        return this.list.filter(isActive);
    },

    /**
     * Adds a Barrel effect.
     *
     * A barrel effect allows you to apply either a 'pinch' or 'expand' distortion to
     * a Game Object. The amount of the effect can be modified in real-time.
     *
     * @method Phaser.GameObjects.Components.FilterList#addBarrel
     * @since 4.0.0
     * @param {number} [amount=1] - The amount of distortion applied to the barrel effect. A value of 1 is no distortion. Typically keep this within +- 1.
     * @return {Phaser.Filters.Barrel} The new Barrel filter controller.
     */
    addBarrel: function (amount)
    {
        return this.add(new Barrel(this.camera, amount));
    },

    /**
     * Adds a Blend effect.
     *
     * A blend effect allows you to apply another texture to the view
     * using a specific blend mode.
     * This supports blend modes not otherwise available in WebGL.
     *
     * @method Phaser.GameObjects.Components.FilterList#addBlend
     * @since 4.0.0
     * @param {Phaser.Textures.Texture} [texture='__WHITE'] - The texture to apply to the view.
     * @param {Phaser.BlendModes} [blendMode=Phaser.BlendModes.NORMAL] - The blend mode to apply to the view.
     * @param {number} [amount=1] - The amount of the blend effect to apply to the view. At 0, the original image is preserved. At 1, the blend texture is fully applied. The expected range is 0 to 1, but you can go outside that range for different effects.
     * @param {number[]} [color=[1, 1, 1, 1]] - The color to apply to the blend texture. Each value corresponds to a color channel in RGBA. The expected range is 0 to 1, but you can go outside that range for different effects.
     */
    addBlend: function (texture, blendMode, amount, color)
    {
        return this.add(new Blend(
            this.camera,
            texture,
            blendMode,
            amount,
            color
        ));
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
     * @since 4.0.0
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
     * @since 4.0.0
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
     * Adds a Color Matrix effect.
     *
     * The color matrix effect is a visual technique that involves manipulating the colors of an image
     * or scene using a mathematical matrix. This process can adjust hue, saturation, brightness, and contrast,
     * allowing developers to create various stylistic appearances or mood settings within the game.
     * Common applications include simulating different lighting conditions, applying color filters,
     * or achieving a specific visual style.
     *
     * @method Phaser.GameObjects.Components.FilterList#addColorMatrix
     * @since 4.0.0
     * @return {Phaser.Filters.ColorMatrix} The new ColorMatrix filter controller.
     */
    addColorMatrix: function ()
    {
        return this.add(new ColorMatrix(this.camera));
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
     * @since 4.0.0
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
     * Adds a Glow effect.
     *
     * The glow effect is a visual technique that creates a soft, luminous halo around game objects,
     * characters, or UI elements. This effect is used to emphasize importance, enhance visual appeal,
     * or convey a sense of energy, magic, or otherworldly presence. The effect can also be set on
     * the inside of the edge. The color and strength of the glow can be modified.
     *
     * @method Phaser.GameObjects.Components.FilterList#addGlow
     * @since 4.0.0
     *
     * @param {number} [color=0xffffff] - The color of the glow effect as a number value.
     * @param {number} [outerStrength=4] - The strength of the glow outward from the edge of textures.
     * @param {number} [innerStrength=0] - The strength of the glow inward from the edge of textures.
     * @param {number} [scale=1] - The scale of the glow effect. This multiplies the fixed distance.
     * @param {boolean} [knockout=false] - If `true` only the glow is drawn, not the texture itself.
     * @param {number} [quality=0.1] - The quality of the glow effect. This cannot be changed after the filter has been created.
     * @param {number} [distance=10] - The distance of the glow effect. This cannot be changed after the filter has been created.
     *
     * @return {Phaser.Filters.Glow} The new Glow filter controller.
     */
    addGlow: function (color, outerStrength, innerStrength, scale, knockout, quality, distance)
    {
        return this.add(new Glow(
            this.camera,
            color,
            outerStrength,
            innerStrength,
            scale,
            knockout,
            quality,
            distance
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
     * @since 4.0.0
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
     * Adds a Parallel Filters effect.
     *
     * This filter controller splits the input into two lists of filters,
     * runs each list separately, and then blends the results together.
     *
     * The Parallel Filters effect is useful for reusing an input.
     * Ordinarily, a filter modifies the input and passes it to the next filter.
     * This effect allows you to split the input and re-use it elsewhere.
     * It does not gain performance benefits from parallel processing;
     * it is a convenience for reusing the input.
     *
     * The Parallel Filters effect is not a filter itself.
     * It is a controller that manages two FilterLists,
     * and the final Blend filter that combines the results.
     * The FilterLists are named 'top' and 'bottom'.
     * The 'top' output is applied as a blend texture to the 'bottom' output.
     *
     * You do not have to populate both lists. If only one is populated,
     * it will be blended with the original input at the end.
     * This is useful when you want to retain image data that would be lost
     * in the filter process.
     *
     * @example
     * // Create a customizable Bloom effect.
     * const camera = this.cameras.main;
     * const parallelFilters = camera.filters.internal.addParallelFilters();
     * parallelFilters.top.addThreshold(0.5, 1);
     * parallelFilters.top.addBlur();
     * parallelFilters.blend.blendMode = Phaser.BlendModes.ADD;
     * parallelFilters.blend.amount = 0.5;
     *
     * @method Phaser.GameObjects.Components.FilterList#addParallelFilters
     * @since 4.0.0
     * @return {Phaser.Filters.ParallelFilters} The new Parallel Filters filter controller.
     */
    addParallelFilters: function ()
    {
        // This import avoids a circular dependency.
        if (!ParallelFilters)
        {
            ParallelFilters = require('../../filters/ParallelFilters');
        }
        return this.add(new ParallelFilters(this.camera));
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
     * @since 4.0.0
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
     * @since 4.0.0
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
     * Adds a Shadow effect.
     *
     * The shadow effect is a visual technique used to create the illusion of depth and realism by adding darker,
     * offset silhouettes or shapes beneath game objects, characters, or environments. These simulated shadows
     * help to enhance the visual appeal and immersion, making the 2D game world appear more dynamic and three-dimensional.
     *
     * @method Phaser.GameObjects.Components.FilterList#addShadow
     * @since 4.0.0
     *
     * @param {number} [x=0] - The horizontal offset of the shadow effect.
     * @param {number} [y=0] - The vertical offset of the shadow effect.
     * @param {number} [decay=0.1] - The amount of decay for the shadow effect.
     * @param {number} [power=1] - The power of the shadow effect.
     * @param {number} [color=0x000000] - The color of the shadow, as a hex value.
     * @param {number} [samples=6] - The number of samples that the shadow effect will run for.
     * @param {number} [intensity=1] - The intensity of the shadow effect.
     *
     * @return {Phaser.Filters.Shadow} The new Shadow filter controller.
     */
    addShadow: function (x, y, decay, power, color, samples, intensity)
    {
        return this.add(new Shadow(
            this.camera,
            x,
            y,
            decay,
            power,
            color,
            samples,
            intensity
        ));
    },

    /**
     * Adds a Threshold effect.
     *
     * Input values are compared to a threshold value or range.
     * Values below the threshold are set to 0, and values above the threshold are set to 1.
     * Values within the range are linearly interpolated between 0 and 1.
     *
     * This is useful for creating effects such as sharp edges from gradients,
     * or for creating binary effects.
     *
     * The threshold is stored as a range, with two edges.
     * Each edge has a value for each channel, between 0 and 1.
     * If the two edges are the same, the threshold has no interpolation,
     * and will output either 0 or 1.
     * Each channel can also be inverted.
     *
     * @method Phaser.GameObjects.Components.FilterList#addThreshold
     * @since 4.0.0
     *
     * @param {number|number[]} [edge1=0.5] - The first edge of the threshold. This may be an array of the RGBA channels, or a single number for all 4 channels.
     * @param {number|number[]} [edge2=0.5] - The second edge of the threshold. This may be an array of the RGBA channels, or a single number for all 4 channels.
     * @param {boolean|boolean[]} [invert=false] - Whether each channel is inverted. This may be an array of the RGBA channels, or a single boolean for all 4 channels.
     *
     * @return {Phaser.Filters.Threshold} The new Threshold filter controller.
     */
    addThreshold: function (edge1, edge2, invert)
    {
        return this.add(new Threshold(
            this.camera,
            edge1,
            edge2,
            invert
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
     * @since 4.0.0
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
     * @since 4.0.0
     */
    destroy: function ()
    {
        this.clear();

        this.camera = null;
    }
});

function isActive (filter)
{
    return filter.active;
}

module.exports = FilterList;
