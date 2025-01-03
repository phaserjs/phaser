/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var FX = require('../pipelines/fx');
var FX_CONST = require('../../../fx/const');
var GetFastValue = require('../../../utils/object/GetFastValue');
var PreFXPipeline = require('./PreFXPipeline');
var Shaders = require('../shaders');
var Utils = require('../Utils');

/**
 * @classdesc
 * The FXPipeline is a built-in pipeline that controls the application of FX Controllers during
 * the rendering process. It maintains all of the FX shaders, instances of Post FX Pipelines and
 * is responsible for rendering.
 *
 * You should rarely interact with this pipeline directly. Instead, use the FX Controllers that
 * is part of the Game Object class in order to manage the effects.
 *
 * @class FXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PreFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser game instance.
 */
var FXPipeline = new Class({

    Extends: PreFXPipeline,

    initialize:

    function FXPipeline (config)
    {
        //  This order is fixed to match with the FX_CONST. Do not adjust.
        config.shaders = [
            Utils.setGlowQuality(Shaders.FXGlowFrag, config.game),
            Shaders.FXShadowFrag,
            Shaders.FXPixelateFrag,
            Shaders.FXVignetteFrag,
            Shaders.FXShineFrag,
            Shaders.FXBlurLowFrag,
            Shaders.FXBlurMedFrag,
            Shaders.FXBlurHighFrag,
            Shaders.FXGradientFrag,
            Shaders.FXBloomFrag,
            Shaders.ColorMatrixFrag,
            Shaders.FXCircleFrag,
            Shaders.FXBarrelFrag,
            Shaders.FXDisplacementFrag,
            Shaders.FXWipeFrag,
            Shaders.FXBokehFrag
        ];

        PreFXPipeline.call(this, config);

        var game = this.game;

        /**
         * An instance of the Glow Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#glow
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.GlowFXPipeline}
         * @since 3.60.0
         */
        this.glow = new FX.Glow(game);

        /**
         * An instance of the Shadow Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#shadow
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline}
         * @since 3.60.0
         */
        this.shadow = new FX.Shadow(game);

        /**
         * An instance of the Pixelate Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#pixelate
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.PixelateFXPipeline}
         * @since 3.60.0
         */
        this.pixelate = new FX.Pixelate(game);

        /**
         * An instance of the Vignette Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#vignette
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.VignetteFXPipeline}
         * @since 3.60.0
         */
        this.vignette = new FX.Vignette(game);

        /**
         * An instance of the Shine Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#shine
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.ShineFXPipeline}
         * @since 3.60.0
         */
        this.shine = new FX.Shine(game);

        /**
         * An instance of the Gradient Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#gradient
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline}
         * @since 3.60.0
         */
        this.gradient = new FX.Gradient(game);

        /**
         * An instance of the Circle Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#circle
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.CircleFXPipeline}
         * @since 3.60.0
         */
        this.circle = new FX.Circle(game);

        /**
         * An instance of the Barrel Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#barrel
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.BarrelFXPipeline}
         * @since 3.60.0
         */
        this.barrel = new FX.Barrel(game);

        /**
         * An instance of the Wipe Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#wipe
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.WipeFXPipeline}
         * @since 3.60.0
         */
        this.wipe = new FX.Wipe(game);

        /**
         * An instance of the Bokeh Post FX Pipeline.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#bokeh
         * @type {Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline}
         * @since 3.60.0
         */
        this.bokeh = new FX.Bokeh(game);

        //  This array is intentionally sparse. Do not adjust.
        var fxHandlers = [];

        fxHandlers[FX_CONST.GLOW] = this.onGlow;
        fxHandlers[FX_CONST.SHADOW] = this.onShadow;
        fxHandlers[FX_CONST.PIXELATE] = this.onPixelate;
        fxHandlers[FX_CONST.VIGNETTE] = this.onVignette;
        fxHandlers[FX_CONST.SHINE] = this.onShine;
        fxHandlers[FX_CONST.BLUR] = this.onBlur;
        fxHandlers[FX_CONST.GRADIENT] = this.onGradient;
        fxHandlers[FX_CONST.BLOOM] = this.onBloom;
        fxHandlers[FX_CONST.COLOR_MATRIX] = this.onColorMatrix;
        fxHandlers[FX_CONST.CIRCLE] = this.onCircle;
        fxHandlers[FX_CONST.BARREL] = this.onBarrel;
        fxHandlers[FX_CONST.DISPLACEMENT] = this.onDisplacement;
        fxHandlers[FX_CONST.WIPE] = this.onWipe;
        fxHandlers[FX_CONST.BOKEH] = this.onBokeh;

        /**
         * An array containing references to the methods that map to the FX CONSTs.
         *
         * This array is intentionally sparse. Do not adjust.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#fxHandlers
         * @type {function[]}
         * @since 3.60.0
         */
        this.fxHandlers = fxHandlers;

        /**
         * The source Render Target.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#source
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.source;

        /**
         * The target Render Target.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#target
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.target;

        /**
         * The swap Render Target.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FXPipeline#swap
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.swap;
    },

    /**
     * Takes the currently bound Game Object and runs all of its pre-render effects,
     * using the given Render Target as the source.
     *
     * Finally calls `drawToGame` to copy the result to the Game Canvas.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onDraw
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} target1 - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target2 - The target Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target3 - The swap Render Target.
     */
    onDraw: function (target1, target2, target3)
    {
        this.source = target1;
        this.target = target2;
        this.swap = target3;

        var width = target1.width;
        var height = target1.height;

        var sprite = this.tempSprite;
        var handlers = this.fxHandlers;

        if (sprite && sprite.preFX)
        {
            var fx = sprite.preFX.list;

            for (var i = 0; i < fx.length; i++)
            {
                var controller = fx[i];

                if (controller.active)
                {
                    handlers[controller.type].call(this, controller, width, height);
                }
            }
        }

        this.drawToGame(this.source);
    },

    /**
     * Takes the source and target and runs a copy from source to target.
     *
     * This will use the current shader and pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#runDraw
     * @since 3.60.0
     */
    runDraw: function ()
    {
        var source = this.source;
        var target = this.target;

        this.copy(source, target);

        this.source = target;
        this.target = source;
    },

    /**
     * Runs the Glow FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onGlow
     * @since 3.60.0
     *
     * @param {Phaser.FX.Glow} config - The Glow FX controller.
     * @param {number} width - The width of the target.
     * @param {number} height - The height of the target.
     */
    onGlow: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.GLOW];

        this.setShader(shader);

        this.glow.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    /**
     * Runs the Shadow FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onShadow
     * @since 3.60.0
     *
     * @param {Phaser.FX.Shadow} config - The Shadow FX controller.
     */
    onShadow: function (config)
    {
        var shader = this.shaders[FX_CONST.SHADOW];

        this.setShader(shader);

        this.shadow.onPreRender(config, shader);

        this.runDraw();
    },

    /**
     * Runs the Pixelate FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onPixelate
     * @since 3.60.0
     *
     * @param {Phaser.FX.Pixelate} config - The Pixelate FX controller.
     * @param {number} width - The width of the target.
     * @param {number} height - The height of the target.
     */
    onPixelate: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.PIXELATE];

        this.setShader(shader);

        this.pixelate.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    /**
     * Runs the Vignette FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onVignette
     * @since 3.60.0
     *
     * @param {Phaser.FX.Vignette} config - The Vignette FX controller.
     */
    onVignette: function (config)
    {
        var shader = this.shaders[FX_CONST.VIGNETTE];

        this.setShader(shader);

        this.vignette.onPreRender(config, shader);

        this.runDraw();
    },

    /**
     * Runs the Shine FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onShine
     * @since 3.60.0
     *
     * @param {Phaser.FX.Shine} config - The Shine FX controller.
     * @param {number} width - The width of the target.
     * @param {number} height - The height of the target.
     */
    onShine: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.SHINE];

        this.setShader(shader);

        this.shine.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    /**
     * Runs the Blur FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onBlur
     * @since 3.60.0
     *
     * @param {Phaser.FX.Blur} config - The Blur FX controller.
     * @param {number} width - The width of the target.
     * @param {number} height - The height of the target.
     */
    onBlur: function (config, width, height)
    {
        var quality = GetFastValue(config, 'quality');

        var shader = this.shaders[FX_CONST.BLUR + quality];

        this.setShader(shader);

        this.set1i('uMainSampler', 0);
        this.set2f('resolution', width, height);
        this.set1f('strength', GetFastValue(config, 'strength'));
        this.set3fv('color', GetFastValue(config, 'glcolor'));

        var x = GetFastValue(config, 'x');
        var y = GetFastValue(config, 'y');
        var steps = GetFastValue(config, 'steps');

        for (var i = 0; i < steps; i++)
        {
            this.set2f('offset', x, 0);
            this.runDraw();

            this.set2f('offset', 0, y);
            this.runDraw();
        }
    },

    /**
     * Runs the Gradient FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onGradient
     * @since 3.60.0
     *
     * @param {Phaser.FX.Gradient} config - The Gradient FX controller.
     */
    onGradient: function (config)
    {
        var shader = this.shaders[FX_CONST.GRADIENT];

        this.setShader(shader);

        this.gradient.onPreRender(config, shader);

        this.runDraw();
    },

    /**
     * Runs the Bloom FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onBloom
     * @since 3.60.0
     *
     * @param {Phaser.FX.Bloom} config - The Bloom FX controller.
     * @param {number} width - The width of the target.
     * @param {number} height - The height of the target.
     */
    onBloom: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.BLOOM];

        this.copySprite(this.source, this.swap);

        this.setShader(shader);

        this.set1i('uMainSampler', 0);
        this.set1f('strength', GetFastValue(config, 'blurStrength'));
        this.set3fv('color', GetFastValue(config, 'glcolor'));

        var x = (2 / width) * GetFastValue(config, 'offsetX');
        var y = (2 / height) * GetFastValue(config, 'offsetY');
        var steps = GetFastValue(config, 'steps');

        for (var i = 0; i < steps; i++)
        {
            this.set2f('offset', x, 0);
            this.runDraw();

            this.set2f('offset', 0, y);
            this.runDraw();
        }

        this.blendFrames(this.swap, this.source, this.target, GetFastValue(config, 'strength'));
        this.copySprite(this.target, this.source);
    },

    /**
     * Runs the ColorMatrix FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onColorMatrix
     * @since 3.60.0
     *
     * @param {Phaser.FX.ColorMatrix} config - The ColorMatrix FX controller.
     */
    onColorMatrix: function (config)
    {
        this.setShader(this.colorMatrixShader);

        this.set1fv('uColorMatrix', config.getData());
        this.set1f('uAlpha', config.alpha);

        this.runDraw();
    },

    /**
     * Runs the Circle FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onCircle
     * @since 3.60.0
     *
     * @param {Phaser.FX.Circle} config - The Circle FX controller.
     * @param {number} width - The width of the target.
     * @param {number} height - The height of the target.
     */
    onCircle: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.CIRCLE];

        this.setShader(shader);

        this.circle.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    /**
     * Runs the Barrel FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onBarrel
     * @since 3.60.0
     *
     * @param {Phaser.FX.Barrel} config - The Barrel FX controller.
     */
    onBarrel: function (config)
    {
        var shader = this.shaders[FX_CONST.BARREL];

        this.setShader(shader);

        this.barrel.onPreRender(config, shader);

        this.runDraw();
    },

    /**
     * Runs the Displacement FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onDisplacement
     * @since 3.60.0
     *
     * @param {Phaser.FX.Displacement} config - The Displacement FX controller.
     */
    onDisplacement: function (config)
    {
        this.setShader(this.shaders[FX_CONST.DISPLACEMENT]);

        this.set1i('uDisplacementSampler', 1);
        this.set2f('amount', config.x, config.y);

        this.bindTexture(config.glTexture, 1);

        this.runDraw();
    },

    /**
     * Runs the Wipe FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onWipe
     * @since 3.60.0
     *
     * @param {Phaser.FX.Wipe} config - The Wipe FX controller.
     */
    onWipe: function (config)
    {
        var shader = this.shaders[FX_CONST.WIPE];

        this.setShader(shader);

        this.wipe.onPreRender(config, shader);

        this.runDraw();
    },

    /**
     * Runs the Bokeh FX controller.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#onBokeh
     * @since 3.60.0
     *
     * @param {Phaser.FX.Bokeh} config - The Bokeh FX controller.
     */
    onBokeh: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.BOKEH];

        this.setShader(shader);

        this.bokeh.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    /**
     * Destroys all shader instances, removes all object references and nulls all external references.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FXPipeline#destroy
     * @since 3.60.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
        this.glow.destroy();
        this.shadow.destroy();
        this.pixelate.destroy();
        this.vignette.destroy();
        this.shine.destroy();
        this.gradient.destroy();
        this.circle.destroy();
        this.barrel.destroy();
        this.wipe.destroy();
        this.bokeh.destroy();

        this.fxHandlers = null;
        this.source = null;
        this.target = null;
        this.swap = null;

        PreFXPipeline.prototype.destroy.call(this);

        return this;
    }
});

module.exports = FXPipeline;
