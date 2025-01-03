/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Effects = require('../../fx/');
var SpliceOne = require('../../utils/array/SpliceOne');

/**
 * @classdesc
 * The FX Component features a set of methods used for applying a range of special built-in effects to a Game Object.
 *
 * The effects include the following:
 *
 * * Barrel Distortion
 * * Bloom
 * * Blur
 * * Bokeh / Tilt Shift
 * * Circle Outline
 * * Color Matrix
 * * Glow
 * * Displacement
 * * Gradient
 * * Pixelate
 * * Shine
 * * Shadow
 * * Vignette
 * * Wipe / Reveal
 *
 * All Game Objects support Post FX. These are effects applied after the Game Object has been rendered.
 *
 * Texture-based Game Objects also support Pre FX, including:
 *
 * * Image
 * * Sprite
 * * TileSprite
 * * Text
 * * RenderTexture
 * * Video
 *
 * And any Game Object that extends the above.
 *
 * The difference between Pre FX and Post FX are that all Post FX take place in a canvas (renderer) sized frame buffer,
 * after the Game Object has been rendered. Pre FX, however, take place in a texture sized frame buffer, which is sized
 * based on the Game Object itself. The end result is then composited back to the main game canvas. For intensive effects,
 * such as blur, bloom or glow, which can require many iterations, this is a much more efficient way to apply the effect,
 * as only it only has to work on a Game Object sized texture and not all pixels in the canvas.
 *
 * In short, you should always try and use a Pre FX if you can.
 *
 * Due to the way that FX work they can be stacked-up. For example, you can apply a blur to a Game Object, then apply
 * a bloom effect to the same Game Object. The bloom effect will be applied to the blurred texture, not the original.
 * Keep the order in mind when stacking effects.
 *
 * All effects are WebGL only and do not have canvas counterparts.
 *
 * As you can appreciate, some effects are more expensive than others. For example, a bloom effect is going to be more
 * expensive than a simple color matrix effect, so please consider using them wisely and performance test your target
 * platforms early on in production.
 *
 * This component is created automatically by the `PostPipeline` class and does not need to be instantiated directly.
 *
 * @class FX
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.60.0
 * @webglOnly
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that owns this FX Component.
 * @param {boolean} isPost - Is this a Pre or Post FX Component?
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
         * @readonly
         * @since 3.60.0
         */
        this.gameObject = gameObject;

        /**
         * Is this a Post FX Controller? or a Pre FX Controller?
         *
         * @name Phaser.GameObjects.Components.FX#isPost
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isPost = isPost;

        /**
         * Has this FX Component been enabled?
         *
         * You should treat this property as read-only, although it is toggled
         * automaticaly during internal use.
         *
         * @name Phaser.GameObjects.Components.FX#enabled
         * @type {boolean}
         * @since 3.60.0
         */
        this.enabled = false;

        /**
         * An array containing all of the Pre FX Controllers that
         * have been added to this FX Component. They are processed in
         * the order they are added.
         *
         * This array is empty if this is a Post FX Component.
         *
         * @name Phaser.GameObjects.Components.FX#list
         * @type {Phaser.FX.Controller[]}
         * @since 3.60.0
         */
        this.list = [];

        /**
         * The amount of extra padding to be applied to this Game Object
         * when it is being rendered by a PreFX Pipeline.
         *
         * Lots of FX require additional spacing added to the texture the
         * Game Object uses, for example a glow or shadow effect, and this
         * method allows you to control how much extra padding is included
         * in addition to the texture size.
         *
         * You do not need to set this if you're only using Post FX.
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
     * You do not need to set this if you're only using Post FX.
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
     * This only applies to Pre FX. Post FX are always enabled.
     *
     * @method Phaser.GameObjects.Components.FX#enable
     * @since 3.60.0
     *
     * @param {number} [padding=0] - The amount of padding to add to this Game Object.
     */
    enable: function (padding)
    {
        if (this.isPost)
        {
            return;
        }

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
     * If this is a Pre FX Component it will only remove Pre FX.
     * If this is a Post FX Component it will only remove Post FX.
     *
     * To remove both at once use the `GameObject.clearFX` method instead.
     *
     * @method Phaser.GameObjects.Components.FX#clear
     * @since 3.60.0
     *
     * @return {this} This Game Object instance.
     */
    clear: function ()
    {
        if (this.isPost)
        {
            this.gameObject.resetPostPipeline(true);
        }
        else
        {
            var list = this.list;

            for (var i = 0; i < list.length; i++)
            {
                list[i].destroy();
            }

            this.list = [];
        }

        this.enabled = false;

        return this.gameObject;
    },

    /**
     * Searches for the given FX Controller within this FX Component.
     *
     * If found, the controller is removed from this component and then destroyed.
     *
     * @method Phaser.GameObjects.Components.FX#remove
     * @since 3.60.0
     *
     * @generic {Phaser.FX.Controller} T
     * @genericUse {T} - [fx]
     *
     * @param {Phaser.FX.Controller} fx - The FX Controller to remove from this FX Component.
     *
     * @return {this} This Game Object instance.
     */
    remove: function (fx)
    {
        var i;

        if (this.isPost)
        {
            var pipelines = this.gameObject.getPostPipeline(String(fx.type));

            if (!Array.isArray(pipelines))
            {
                pipelines = [ pipelines ];
            }

            for (i = 0; i < pipelines.length; i++)
            {
                var pipeline = pipelines[i];

                if (pipeline.controller === fx)
                {
                    this.gameObject.removePostPipeline(pipeline);

                    fx.destroy();

                    break;
                }
            }
        }
        else
        {
            var list = this.list;

            for (i = 0; i < list.length; i++)
            {
                if (list[i] === fx)
                {
                    SpliceOne(list, i);

                    fx.destroy();
                }
            }
        }

        return this.gameObject;
    },

    /**
     * Disables this FX Component.
     *
     * This will reset the pipeline on the Game Object that owns this component back to its
     * default and flag this component as disabled.
     *
     * You can re-enable it again by calling `enable` for Pre FX or by adding an FX for Post FX.
     *
     * Optionally, set `clear` to destroy all current FX Controllers.
     *
     * @method Phaser.GameObjects.Components.FX#disable
     * @since 3.60.0
     *
     * @param {boolean} [clear=false] - Destroy and remove all FX Controllers that are part of this component.
     *
     * @return {this} This Game Object instance.
     */
    disable: function (clear)
    {
        if (clear === undefined) { clear = false; }

        if (!this.isPost)
        {
            this.gameObject.resetPipeline();
        }

        this.enabled = false;

        if (clear)
        {
            this.clear();
        }

        return this.gameObject;
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
     * @generic {Phaser.FX.Controller} T
     * @genericUse {T} - [fx]
     *
     * @param {Phaser.FX.Controller} fx - The FX Controller to add to this FX Component.
     * @param {object} [config] - Optional configuration object that is passed to the pipeline during instantiation.
     *
     * @return {Phaser.FX.Controller} The FX Controller.
     */
    add: function (fx, config)
    {
        if (this.isPost)
        {
            var type = String(fx.type);

            this.gameObject.setPostPipeline(type, config);

            var pipeline = this.gameObject.getPostPipeline(type);

            if (pipeline)
            {
                if (Array.isArray(pipeline))
                {
                    pipeline = pipeline.pop();
                }

                if (pipeline)
                {
                    pipeline.controller = fx;
                }

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
     * The glow effect is a visual technique that creates a soft, luminous halo around game objects,
     * characters, or UI elements. This effect is used to emphasize importance, enhance visual appeal,
     * or convey a sense of energy, magic, or otherworldly presence. The effect can also be set on
     * the inside of the Game Object. The color and strength of the glow can be modified.
     *
     * @method Phaser.GameObjects.Components.FX#addGlow
     * @since 3.60.0
     *
     * @param {number} [color=0xffffff] - The color of the glow effect as a number value.
     * @param {number} [outerStrength=4] - The strength of the glow outward from the edge of the Sprite.
     * @param {number} [innerStrength=0] - The strength of the glow inward from the edge of the Sprite.
     * @param {boolean} [knockout=false] - If `true` only the glow is drawn, not the texture itself.
     * @param {number} [quality=0.1] - Only available for PostFX. Sets the quality of this Glow effect. Default is 0.1. Cannot be changed post-creation.
     * @param {number} [distance=10] - Only available for PostFX. Sets the distance of this Glow effect. Default is 10. Cannot be changed post-creation.
     *
     * @return {Phaser.FX.Glow} The Glow FX Controller.
     */
    addGlow: function (color, outerStrength, innerStrength, knockout, quality, distance)
    {
        return this.add(new Effects.Glow(this.gameObject, color, outerStrength, innerStrength, knockout), { quality: quality, distance: distance });
    },

    /**
     * Adds a Shadow effect.
     *
     * The shadow effect is a visual technique used to create the illusion of depth and realism by adding darker,
     * offset silhouettes or shapes beneath game objects, characters, or environments. These simulated shadows
     * help to enhance the visual appeal and immersion, making the 2D game world appear more dynamic and three-dimensional.
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
     * The pixelate effect is a visual technique that deliberately reduces the resolution or detail of an image,
     * creating a blocky or mosaic appearance composed of large, visible pixels. This effect can be used for stylistic
     * purposes, as a homage to retro gaming, or as a means to obscure certain elements within the game, such as
     * during a transition or to censor specific content.
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
     * The vignette effect is a visual technique where the edges of the screen, or a Game Object, gradually darken or blur,
     * creating a frame-like appearance. This effect is used to draw the player's focus towards the central action or subject,
     * enhance immersion, and provide a cinematic or artistic quality to the game's visuals.
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
     * The shine effect is a visual technique that simulates the appearance of reflective
     * or glossy surfaces by passing a light beam across a Game Object. This effect is used to
     * enhance visual appeal, emphasize certain features, and create a sense of depth or
     * material properties.
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
     * A Gaussian blur is the result of blurring an image by a Gaussian function. It is a widely used effect,
     * typically to reduce image noise and reduce detail. The visual effect of this blurring technique is a
     * smooth blur resembling that of viewing the image through a translucent screen, distinctly different
     * from the bokeh effect produced by an out-of-focus lens or the shadow of an object under usual illumination.
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
     * The gradient overlay effect is a visual technique where a smooth color transition is applied over Game Objects,
     * such as sprites or UI components. This effect is used to enhance visual appeal, emphasize depth, or create
     * stylistic and atmospheric variations. It can also be utilized to convey information, such as representing
     * progress or health status through color changes.
     *
     * @method Phaser.GameObjects.Components.FX#addGradient
     * @since 3.60.0
     *
     * @param {number} [color1=0xff0000] - The first gradient color, given as a number value.
     * @param {number} [color2=0x00ff00] - The second gradient color, given as a number value.
     * @param {number} [alpha=0.2] - The alpha value of the gradient effect.
     * @param {number} [fromX=0] - The horizontal position the gradient will start from. This value is normalized, between 0 and 1, and is not in pixels.
     * @param {number} [fromY=0] - The vertical position the gradient will start from. This value is normalized, between 0 and 1, and is not in pixels.
     * @param {number} [toX=0] - The horizontal position the gradient will end at. This value is normalized, between 0 and 1, and is not in pixels.
     * @param {number} [toY=1] - The vertical position the gradient will end at. This value is normalized, between 0 and 1, and is not in pixels.
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
     * Bloom is an effect used to reproduce an imaging artifact of real-world cameras.
     * The effect produces fringes of light extending from the borders of bright areas in an image,
     * contributing to the illusion of an extremely bright light overwhelming the
     * camera or eye capturing the scene.
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
     * The color matrix effect is a visual technique that involves manipulating the colors of an image
     * or scene using a mathematical matrix. This process can adjust hue, saturation, brightness, and contrast,
     * allowing developers to create various stylistic appearances or mood settings within the game.
     * Common applications include simulating different lighting conditions, applying color filters,
     * or achieving a specific visual style.
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
     * This effect will draw a circle around the texture of the Game Object, effectively masking off
     * any area outside of the circle without the need for an actual mask. You can control the thickness
     * of the circle, the color of the circle and the color of the background, should the texture be
     * transparent. You can also control the feathering applied to the circle, allowing for a harsh or soft edge.
     *
     * Please note that adding this effect to a Game Object will not change the input area or physics body of
     * the Game Object, should it have one.
     *
     * @method Phaser.GameObjects.Components.FX#addCircle
     * @since 3.60.0
     *
     * @param {number} [thickness=8] - The width of the circle around the texture, in pixels.
     * @param {number} [color=0xfeedb6] - The color of the circular ring, given as a number value.
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
     * A barrel effect allows you to apply either a 'pinch' or 'expand' distortion to
     * a Game Object. The amount of the effect can be modified in real-time.
     *
     * @method Phaser.GameObjects.Components.FX#addBarrel
     * @since 3.60.0
     *
     * @param {number} [amount=1] - The amount of distortion applied to the barrel effect. A value of 1 is no distortion. Typically keep this within +- 1.
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
     * The displacement effect is a visual technique that alters the position of pixels in an image
     * or texture based on the values of a displacement map. This effect is used to create the illusion
     * of depth, surface irregularities, or distortion in otherwise flat elements. It can be applied to
     * characters, objects, or backgrounds to enhance realism, convey movement, or achieve various
     * stylistic appearances.
     *
     * @method Phaser.GameObjects.Components.FX#addDisplacement
     * @since 3.60.0
     *
     * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
     * @param {number} [x=0.005] - The amount of horizontal displacement to apply. A very small float number, such as 0.005.
     * @param {number} [y=0.005] - The amount of vertical displacement to apply. A very small float number, such as 0.005.
     *
     * @return {Phaser.FX.Displacement} The Displacement FX Controller.
     */
    addDisplacement: function (texture, x, y)
    {
        return this.add(new Effects.Displacement(this.gameObject, texture, x, y));
    },

    /**
     * Adds a Wipe effect.
     *
     * The wipe or reveal effect is a visual technique that gradually uncovers or conceals elements
     * in the game, such as images, text, or scene transitions. This effect is often used to create
     * a sense of progression, reveal hidden content, or provide a smooth and visually appealing transition
     * between game states.
     *
     * You can set both the direction and the axis of the wipe effect. The following combinations are possible:
     *
     * * left to right: direction 0, axis 0
     * * right to left: direction 1, axis 0
     * * top to bottom: direction 1, axis 1
     * * bottom to top: direction 1, axis 0
     *
     * It is up to you to set the `progress` value yourself, i.e. via a Tween, in order to transition the effect.
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
     * The wipe or reveal effect is a visual technique that gradually uncovers or conceals elements
     * in the game, such as images, text, or scene transitions. This effect is often used to create
     * a sense of progression, reveal hidden content, or provide a smooth and visually appealing transition
     * between game states.
     *
     * You can set both the direction and the axis of the wipe effect. The following combinations are possible:
     *
     * * left to right: direction 0, axis 0
     * * right to left: direction 1, axis 0
     * * top to bottom: direction 1, axis 1
     * * bottom to top: direction 1, axis 0
     *
     * It is up to you to set the `progress` value yourself, i.e. via a Tween, in order to transition the effect.
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
     * Bokeh refers to a visual effect that mimics the photographic technique of creating a shallow depth of field.
     * This effect is used to emphasize the game's main subject or action, by blurring the background or foreground
     * elements, resulting in a more immersive and visually appealing experience. It is achieved through rendering
     * techniques that simulate the out-of-focus areas, giving a sense of depth and realism to the game's graphics.
     *
     * See also Tilt Shift.
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
     * Adds a Tilt Shift effect.
     *
     * This Bokeh effect can also be used to generate a Tilt Shift effect, which is a technique used to create a miniature
     * effect by blurring everything except a small area of the image. This effect is achieved by blurring the
     * top and bottom elements, while keeping the center area in focus.
     *
     * See also Bokeh.
     *
     * @method Phaser.GameObjects.Components.FX#addTiltShift
     * @since 3.60.0
     *
     * @param {number} [radius=0.5] - The radius of the bokeh effect.
     * @param {number} [amount=1] - The amount of the bokeh effect.
     * @param {number} [contrast=0.2] - The color contrast of the bokeh effect.
     * @param {number} [blurX=1] - The amount of horizontal blur.
     * @param {number} [blurY=1] - The amount of vertical blur.
     * @param {number} [strength=1] - The strength of the blur.
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
