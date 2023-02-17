/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Effects = require('../../fx/');
var SpliceOne = require('../../utils/array/SpliceOne');

/**
 * @classdesc
 *
 * @class FX
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.60.0
 * @webglOnly
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that owns this FX Component.
 * @param {boolean} isPost - Is this a Pre or Post FX Component?
+- *
 */
var FX = new Class({

    initialize:

    function FX (gameObject, isPost)
    {
        /**
         * A reference to the Game Object that owns this FX Component.
         *
         * @name Phaser.GameObjects.Components.FX#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.60.0
         */
        this.gameObject = gameObject;

        /**
         * Is this a Post FX Controller? or a Pre FX Controller?
         *
         * @name Phaser.GameObjects.Components.FX#isPost
         * @type {boolean}
         * @since 3.60.0
         */
        this.isPost = isPost;

        /**
         * Has this FX Component been enabled?
         *
         * You should treat this property as read-only.
         *
         * @name Phaser.GameObjects.Components.FX#enabled
         * @type {boolean}
         * @since 3.60.0
         */
        this.enabled = false;

        /**
         * An array containing all of the FX Controllers that
         * have been added to this FX Component.
         *
         * @name Phaser.GameObjects.Components.FX#list
         * @type {Phaser.FX.Controller[]}
         * @since 3.60.0
         */
        this.list = [];

        /**
         * The amount of extra padding to be applied to this Game Object
         * when it is being rendered by a PreFX or SpriteFX Pipeline.
         *
         * Lots of FX require additional spacing added to the texture the
         * Game Object uses, for example a glow or shadow effect, and this
         * method allows you to control how much extra padding is included
         * in addition to the texture size.
         *
         * @name Phaser.GameObjects.Components.FX#padding
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.padding = 0;
    },

    /**
     * Sets the amount of extra padding to be applied to this Game Object
     * when it is being rendered by a PreFX Pipeline.
     *
     * Lots of FX require additional spacing added to the texture the
     * Game Object uses, for example a glow or shadow effect, and this
     * method allows you to control how much extra padding is included
     * in addition to the texture size.
     *
     * @method Phaser.GameObjects.Components.FX#setPadding
     * @webglOnly
     * @since 3.60.0
     *
     * @param {number} [padding=0] - The amount of padding to add to this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setPadding: function (padding)
    {
        if (padding === undefined) { padding = 0; }

        this.padding = padding;

        return this.gameObject;
    },

    /**
     * This callback is invoked when this Game Object is copied by a PreFX Pipeline.
     *
     * This happens when the pipeline uses its `copySprite` method.
     *
     * It's invoked prior to the copy, allowing you to set shader uniforms, etc on the pipeline.
     *
     * @method Phaser.GameObjects.Components.FX#onFXCopy
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.Pipelines.PreFXPipeline} pipeline - The PreFX Pipeline that invoked this callback.
     */
    onFXCopy: function ()
    {
    },

    /**
     * This callback is invoked when this Game Object is rendered by a PreFX Pipeline.
     *
     * This happens when the pipeline uses its `drawSprite` method.
     *
     * It's invoked prior to the draw, allowing you to set shader uniforms, etc on the pipeline.
     *
     * @method Phaser.GameObjects.Components.FX#onFX
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.Pipelines.PreFXPipeline} pipeline - The PreFX Pipeline that invoked this callback.
     */
    onFX: function ()
    {
    },

    /**
     * Enables this FX Component and applies the FXPipeline to the parent Game Object.
     *
     * This is called automatically whenever you call a method such as `addBloom`, etc.
     *
     * You can check the `enabled` property to see if the Game Object is already enabled, or not.
     *
     * @method Phaser.GameObjects.Components.FX#enable
     * @since 3.60.0
     *
     * @param {number} [padding=0] - The amount of padding to add to this Game Object.
     */
    enable: function (padding)
    {
        var renderer = this.gameObject.scene.sys.renderer;

        if (renderer && renderer.pipelines)
        {
            this.gameObject.pipeline = renderer.pipelines.FX_PIPELINE;

            if (padding !== undefined)
            {
                this.padding = padding;
            }

            this.enabled = true;
        }
        else
        {
            this.enabled = false;
        }
    },

    /**
     * Destroys and removes all FX Controllers that are part of this FX Component,
     * then disables it.
     *
     * @method Phaser.GameObjects.Components.FX#clear
     * @since 3.60.0
     */
    clear: function ()
    {
        var list = this.list;

        for (var i = 0; i < list.length; i++)
        {
            list[i].destroy();
        }

        this.list = [];

        this.enabled = false;
    },

    /**
     * Searches for the given FX Controler within this FX Component.
     *
     * If found, the controller is removed from this compoent and then destroyed.
     *
     * @method Phaser.GameObjects.Components.FX#remove
     * @since 3.60.0
     *
     * @param {Phaser.FX.Controller} fx - The FX Controller to remove from this FX Component.
     */
    remove: function (fx)
    {
        var list = this.list;

        for (var i = 0; i < list.length; i++)
        {
            if (list[i] === fx)
            {
                SpliceOne(list, i);

                fx.destroy();
            }
        }
    },

    /**
     * Disables this FX Component.
     *
     * This will reset the pipeline on the Game Object that owns this component back to its
     * default and flag this component as disabled.
     *
     * You can re-enable it again by calling `enable`.
     *
     * Optionally, set `clear` to destroy all current FX Controllers.
     *
     * @method Phaser.GameObjects.Components.FX#disable
     * @since 3.60.0
     *
     * @param {boolean} [clear=false] - Destroy and remove all FX Controllers that are part of this FX Component.
     */
    disable: function (clear)
    {
        if (clear === undefined) { clear = false; }

        this.gameObject.resetPipeline();

        this.enabled = false;

        if (clear)
        {
            this.clear();
        }
    },

    /**
     * Adds the given FX Controler to this FX Component.
     *
     * Note that adding an FX Controller does not remove any existing FX. They all stack-up
     * on-top of each other. If you don't want this, make sure to call either `remove` or
     * `clear` first.
     *
     * @method Phaser.GameObjects.Components.FX#add
     * @since 3.60.0
     *
     * @param {Phaser.FX.Controller} fx - The FX Controller to add to this FX Component.
     *
     * @return {Phaser.FX.Controller} The FX Controller.
     */
    add: function (fx)
    {
        if (this.isPost)
        {
            var type = String(fx.type);

            this.gameObject.setPostPipeline(type);

            var pipeline = this.gameObject.getPostPipeline(type);

            if (pipeline)
            {
                if (Array.isArray(pipeline))
                {
                    pipeline = pipeline.pop();
                }

                pipeline.controller = fx;

                return fx;
            }
        }
        else
        {
            if (!this.enabled)
            {
                this.enable();
            }

            this.list.push(fx);

            return fx;
        }
    },

    /**
     * Adds a Glow effect.
     *
     * @method Phaser.GameObjects.Components.FX#addGlow
     * @since 3.60.0
     *
     * @param {number} [color=0xffffff] - The color of the glow effect as a number value.
     * @param {number} [distance=16] - The distance of the glow. This must be an integer and can be between 0 and 128 inclusive.
     * @param {number} [outerStrength=4] - The strength of the glow outward from the edge of the Sprite.
     * @param {number} [innerStrength=0] - The strength of the glow inward from the edge of the Sprite.
     * @param {boolean} [knockout=false] - If `true` only the glow is drawn, not the texture itself.
     *
     * @return {Phaser.FX.Glow} The Glow FX Controller.
     */
    addGlow: function (color, distance, outerStrength, innerStrength, knockout)
    {
        return this.add(new Effects.Glow(this.gameObject, color, distance, outerStrength, innerStrength, knockout));
    },

    /**
     * Adds a Shadow effect.
     *
     * @method Phaser.GameObjects.Components.FX#addShadow
     * @since 3.60.0
     *
     * @param {number} [x=0] - The horizontal offset of the shadow effect.
     * @param {number} [y=0] - The vertical offset of the shadow effect.
     * @param {number} [decay=0.1] - The amount of decay for shadow effect.
     * @param {number} [power=1] - The power of the shadow effect.
     * @param {number} [color=0x000000] - The color of the shadow.
     * @param {number} [samples=6] - The number of samples that the shadow effect will run for. An integer between 1 and 12.
     * @param {number} [intensity=1] - The intensity of the shadow effect.
     *
     * @return {Phaser.FX.Shadow} The Shadow FX Controller.
     */
    addShadow: function (x, y, decay, power, color, samples, intensity)
    {
        return this.add(new Effects.Shadow(this.gameObject, x, y, decay, power, color, samples, intensity));
    },

    /**
     * Adds a Pixelate effect.
     *
     * @method Phaser.GameObjects.Components.FX#addPixelate
     * @since 3.60.0
     *
     * @param {number} [amount=1] - The amount of pixelation to apply.
     *
     * @return {Phaser.FX.Pixelate} The Pixelate FX Controller.
     */
    addPixelate: function (amount)
    {
        return this.add(new Effects.Pixelate(this.gameObject, amount));
    },

    /**
     * Adds a Vignette effect.
     *
     * @method Phaser.GameObjects.Components.FX#addVignette
     * @since 3.60.0
     *
     * @param {number} [x=0.5] - The horizontal offset of the vignette effect. This value is normalized to the range 0 to 1.
     * @param {number} [y=0.5] - The vertical offset of the vignette effect. This value is normalized to the range 0 to 1.
     * @param {number} [radius=0.5] - The radius of the vignette effect. This value is normalized to the range 0 to 1.
     * @param {number} [strength=0.5] - The strength of the vignette effect.
     *
     * @return {Phaser.FX.Vignette} The Vignette FX Controller.
     */
    addVignette: function (x, y, radius, strength)
    {
        return this.add(new Effects.Vignette(this.gameObject, x, y, radius, strength));
    },

    /**
     * Adds a Shine effect.
     *
     * @method Phaser.GameObjects.Components.FX#addShine
     * @since 3.60.0
     *
     * @param {number} [speed=0.5] - The speed of the Shine effect.
     * @param {number} [lineWidth=0.5] - The line width of the Shine effect.
     * @param {number} [gradient=3] - The gradient of the Shine effect.
     * @param {boolean} [reveal=false] - Does this Shine effect reveal or get added to its target?
     *
     * @return {Phaser.FX.Shine} The Shine FX Controller.
     */
    addShine: function (speed, lineWidth, gradient, reveal)
    {
        return this.add(new Effects.Shine(this.gameObject, speed, lineWidth, gradient, reveal));
    },

    /**
     * Adds a Blur effect.
     *
     * @method Phaser.GameObjects.Components.FX#addBlur
     * @since 3.60.0
     *
     * @param {number} [quality=0] - The quality of the blur effect. Can be either 0 for Low Quality, 1 for Medium Quality or 2 for High Quality.
     * @param {number} [x=2] - The horizontal offset of the blur effect.
     * @param {number} [y=2] - The vertical offset of the blur effect.
     * @param {number} [strength=1] - The strength of the blur effect.
     * @param {number} [color=0xffffff] - The color of the blur, as a hex value.
     * @param {number} [steps=4] - The number of steps to run the blur effect for. This value should always be an integer.
     *
     * @return {Phaser.FX.Blur} The Blur FX Controller.
     */
    addBlur: function (quality, x, y, strength, color, steps)
    {
        return this.add(new Effects.Blur(this.gameObject, quality, x, y, strength, color, steps));
    },

    /**
     * Adds a Gradient effect.
     *
     * @method Phaser.GameObjects.Components.FX#addGradient
     * @since 3.60.0
     *
     * @param {number} [color1=0xff0000] - The first gradient color, given as a number value.
     * @param {number} [color2=0x00ff00] - The second gradient color, given as a number value.
     * @param {number} [alpha=0.2] - The alpha value of the gradient effect.
     * @param {number} [fromX=0] - The horizontal position the gradient will start from. This value is noralized, between 0 and 1 and is not in pixels.
     * @param {number} [fromY=0] - The vertical position the gradient will start from. This value is noralized, between 0 and 1 and is not in pixels.
     * @param {number} [toX=0] - The horizontal position the gradient will end at. This value is noralized, between 0 and 1 and is not in pixels.
     * @param {number} [toY=1] - The vertical position the gradient will end at. This value is noralized, between 0 and 1 and is not in pixels.
     * @param {number} [size=0] - How many 'chunks' the gradient is divided in to, as spread over the entire height of the texture. Leave this at zero for a smooth gradient, or set higher for a more retro chunky effect.
     *
     * @return {Phaser.FX.Gradient} The Gradient FX Controller.
     */
    addGradient: function (color1, color2, alpha, fromX, fromY, toX, toY, size)
    {
        return this.add(new Effects.Gradient(this.gameObject, color1, color2, alpha, fromX, fromY, toX, toY, size));
    },

    /**
     * Adds a Bloom effect.
     *
     * @method Phaser.GameObjects.Components.FX#addBloom
     * @since 3.60.0
     *
     * @param {number} [color] - The color of the Bloom, as a hex value.
     * @param {number} [offsetX=1] - The horizontal offset of the bloom effect.
     * @param {number} [offsetY=1] - The vertical offset of the bloom effect.
     * @param {number} [blurStrength=1] - The strength of the blur process of the bloom effect.
     * @param {number} [strength=1] - The strength of the blend process of the bloom effect.
     * @param {number} [steps=4] - The number of steps to run the Bloom effect for. This value should always be an integer.
     *
     * @return {Phaser.FX.Bloom} The Bloom FX Controller.
     */
    addBloom: function (color, offsetX, offsetY, blurStrength, strength, steps)
    {
        return this.add(new Effects.Bloom(this.gameObject, color, offsetX, offsetY, blurStrength, strength, steps));
    },

    /**
     * Adds a ColorMatrix effect.
     *
     * @method Phaser.GameObjects.Components.FX#addColorMatrix
     * @since 3.60.0
     *
     * @return {Phaser.FX.ColorMatrix} The ColorMatrix FX Controller.
     */
    addColorMatrix: function ()
    {
        return this.add(new Effects.ColorMatrix(this.gameObject));
    },

    /**
     * Adds a Circle effect.
     *
     * @method Phaser.GameObjects.Components.FX#addCircle
     * @since 3.60.0
     *
     * @param {number} [thickness=8] - The width of the circle around the texture, in pixels.
     * @param {number} [color=16724914] - The color of the circular ring, given as a number value.
     * @param {number} [backgroundColor=0xff0000] - The color of the background, behind the texture, given as a number value.
     * @param {number} [scale=1] - The scale of the circle. The default scale is 1, which is a circle the full size of the underlying texture.
     * @param {number} [feather=0.005] - The amount of feathering to apply to the circle from the ring.
     *
     * @return {Phaser.FX.Circle} The Circle FX Controller.
     */
    addCircle: function (thickness, color, backgroundColor, scale, feather)
    {
        return this.add(new Effects.Circle(this.gameObject, thickness, color, backgroundColor, scale, feather));
    },

    /**
     * Adds a Barrel effect.
     *
     * @method Phaser.GameObjects.Components.FX#addBarrel
     * @since 3.60.0
     *
     * @param {number} [amount=1] - The amount of distortion applied to the barrel effect. Typically keep this within the range 0 (no distortion) to 1.
     *
     * @return {Phaser.FX.Barrel} The Barrel FX Controller.
     */
    addBarrel: function (amount)
    {
        return this.add(new Effects.Barrel(this.gameObject, amount));
    },

    /**
     * Adds a Displacement effect.
     *
     * @method Phaser.GameObjects.Components.FX#addDisplacement
     * @since 3.60.0
     *
     * @param {string} [key='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
     * @param {number} [x=0.005] - The amount of horizontal displacement to apply.
     * @param {number} [y=0.005] - The amount of vertical displacement to apply.
     *
     * @return {Phaser.FX.Displacement} The Displacement FX Controller.
     */
    addDisplacement: function (displacementTexture, x, y)
    {
        return this.add(new Effects.Displacement(this.gameObject, displacementTexture, x, y));
    },

    /**
     * Adds a Wipe effect.
     *
     * @method Phaser.GameObjects.Components.FX#addWipe
     * @since 3.60.0
     *
     * @param {number} [wipeWidth=0.1] - The width of the wipe effect. This value is normalized in the range 0 to 1.
     * @param {number} [direction=0] - The direction of the wipe effect. Either 0 or 1. Set in conjunction with the axis property.
     * @param {number} [axis=0] - The axis of the wipe effect. Either 0 or 1. Set in conjunction with the direction property.
     *
     * @return {Phaser.FX.Wipe} The Wipe FX Controller.
     */
    addWipe: function (wipeWidth, direction, axis)
    {
        return this.add(new Effects.Wipe(this.gameObject, wipeWidth, direction, axis));
    },

    /**
     * Adds a Reveal Wipe effect.
     *
     * @method Phaser.GameObjects.Components.FX#addReveal
     * @since 3.60.0
     *
     * @param {number} [wipeWidth=0.1] - The width of the wipe effect. This value is normalized in the range 0 to 1.
     * @param {number} [direction=0] - The direction of the wipe effect. Either 0 or 1. Set in conjunction with the axis property.
     * @param {number} [axis=0] - The axis of the wipe effect. Either 0 or 1. Set in conjunction with the direction property.
     *
     * @return {Phaser.FX.Wipe} The Wipe FX Controller.
     */
    addReveal: function (wipeWidth, direction, axis)
    {
        return this.add(new Effects.Wipe(this.gameObject, wipeWidth, direction, axis, true));
    },

    /**
     * Adds a Bokeh effect.
     *
     * @method Phaser.GameObjects.Components.FX#addBokeh
     * @since 3.60.0
     *
     * @param {number} [radius=0.5] - The radius of the bokeh effect.
     * @param {number} [amount=1] - The amount of the bokeh effect.
     * @param {number} [contrast=0.2] - The color contrast of the bokeh effect.
     *
     * @return {Phaser.FX.Bokeh} The Bokeh FX Controller.
     */
    addBokeh: function (radius, amount, contrast)
    {
        return this.add(new Effects.Bokeh(this.gameObject, radius, amount, contrast));
    },

    /**
     * Adds a TiltShift effect.
     *
     * @method Phaser.GameObjects.Components.FX#addTiltShift
     * @since 3.60.0
     *
     * @param {number} [radius=0.5] - The radius of the bokeh effect.
     * @param {number} [amount=1] - The amount of the bokeh effect.
     * @param {number} [contrast=0.2] - The color contrast of the bokeh effect.
     * @param {number} [blurX=1] - If Tilt Shift, the amount of horizontal blur.
     * @param {number} [blurY=1] - If Tilt Shift, the amount of vertical blur.
     * @param {number} [strength=1] - If Tilt Shift, the strength of the blur.
     *
     * @return {Phaser.FX.Bokeh} The Bokeh TiltShift FX Controller.
     */
    addTiltShift: function (radius, amount, contrast, blurX, blurY, strength)
    {
        return this.add(new Effects.Bokeh(this.gameObject, radius, amount, contrast, true, blurX, blurY, strength));
    },

    /**
     * Destroys this FX Component.
     *
     * Called automatically when Game Objects are destroyed.
     *
     * @method Phaser.GameObjects.Components.FX#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        this.clear();

        this.gameObject = null;
    }

});

module.exports = FX;
