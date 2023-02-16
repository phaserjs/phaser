/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Effects = require('../fx/');
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
 */
var FX = new Class({

    initialize:

    function FX (gameObject)
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
         * An array containing all of the FX that have been added to this FX Component.
         *
         * @name Phaser.GameObjects.Components.FX#list
         * @type {Phaser.GameObjects.FX.BaseFX[]}
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

    remove: function (fx)
    {
        var list = this.list;

        for (var i = 0; i < list.length; i++)
        {
            if (list[i] === fx)
            {
                SpliceOne(list, i);
            }
        }
    },

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

    add: function (fx)
    {
        if (!this.enabled)
        {
            this.enable();
        }

        this.list.push(fx);

        return fx;
    },

    addGlow: function (distance, outerStrength, innerStrength, knockout, color)
    {
        return this.add(new Effects.Glow(this.gameObject, distance, outerStrength, innerStrength, knockout, color));
    },

    addShadow: function (x, y, decay, power, color, samples, intensity)
    {
        return this.add(new Effects.Shadow(this.gameObject, x, y, decay, power, color, samples, intensity));
    },

    addPixelate: function (amount)
    {
        return this.add(new Effects.Pixelate(this.gameObject, amount));
    },

    addVignette: function (x, y, radius, strength)
    {
        return this.add(new Effects.Vignette(this.gameObject, x, y, radius, strength));
    },

    addShine: function ()
    {
        return this.add(new Effects.Shine(this.gameObject));
    },

    addBlur: function ()
    {
        return this.add(new Effects.Blur(this.gameObject));
    },

    addGradient: function ()
    {
        return this.add(new Effects.Gradient(this.gameObject));
    },

    addBloom: function ()
    {
        return this.add(new Effects.Bloom(this.gameObject));
    },

    addColorMatrix: function ()
    {
        return this.add(new Effects.ColorMatrix(this.gameObject));
    },

    addCircle: function ()
    {
        return this.add(new Effects.Circle(this.gameObject));
    },

    addBarrel: function ()
    {
        return this.add(new Effects.Barrel(this.gameObject));
    },

    addDisplacement: function ()
    {
        return this.add(new Effects.Displacement(this.gameObject));
    },

    addWipe: function ()
    {
        return this.add(new Effects.Wipe(this.gameObject));
    },

    addBokeh: function ()
    {
        return this.add(new Effects.Bokeh(this.gameObject));
    }

});

module.exports = FX;
