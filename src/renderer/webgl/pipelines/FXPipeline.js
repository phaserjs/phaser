/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var FX = require('../pipelines/fx');
var FX_CONST = require('../../../fx/const');
var GetFastValue = require('../../../utils/object/GetFastValue');
var PreFXPipeline = require('./PreFXPipeline');
var Shaders = require('../shaders');

/**
 * @classdesc
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
            Shaders.FXGlowFrag,
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

        this.glow = new FX.Glow(game);
        this.shadow = new FX.Shadow(game);
        this.pixelate = new FX.Pixelate(game);
        this.vignette = new FX.Vignette(game);
        this.shine = new FX.Shine(game);
        this.gradient = new FX.Gradient(game);
        this.circle = new FX.Circle(game);
        this.barrel = new FX.Barrel(game);
        this.wipe = new FX.Wipe(game);
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

        this.fxHandlers = fxHandlers;

        this.source;
        this.target;
        this.swap;
    },

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

    runDraw: function ()
    {
        var source = this.source;
        var target = this.target;

        this.copy(source, target);

        this.source = target;
        this.target = source;
    },

    onGlow: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.GLOW];

        this.setShader(shader);

        this.glow.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    onShadow: function (config)
    {
        var shader = this.shaders[FX_CONST.SHADOW];

        this.setShader(shader);

        this.shadow.onPreRender(config, shader);

        this.runDraw();
    },

    onPixelate: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.PIXELATE];

        this.setShader(shader);

        this.pixelate.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    onVignette: function (config)
    {
        var shader = this.shaders[FX_CONST.VIGNETTE];

        this.setShader(shader);

        this.vignette.onPreRender(config, shader);

        this.runDraw();
    },

    onShine: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.SHINE];

        this.setShader(shader);

        this.shine.onPreRender(config, shader, width, height);

        this.runDraw();
    },

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

    onGradient: function (config)
    {
        var shader = this.shaders[FX_CONST.GRADIENT];

        this.setShader(shader);

        this.gradient.onPreRender(config, shader);

        this.runDraw();
    },

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

    onColorMatrix: function (config)
    {
        this.setShader(this.colorMatrixShader);

        this.set1fv('uColorMatrix', config.getData());
        this.set1f('uAlpha', config.alpha);

        this.runDraw();
    },

    onCircle: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.CIRCLE];

        this.setShader(shader);

        this.circle.onPreRender(config, shader, width, height);

        this.runDraw();
    },

    onBarrel: function (config)
    {
        var shader = this.shaders[FX_CONST.BARREL];

        this.setShader(shader);

        this.barrel.onPreRender(config, shader);

        this.runDraw();
    },

    onDisplacement: function (config)
    {
        this.setShader(this.shaders[FX_CONST.DISPLACEMENT]);

        this.set1i('uDisplacementSampler', 1);
        this.set2f('amount', config.x, config.y);

        this.bindTexture(config.glTexture, 1);

        this.runDraw();
    },

    onWipe: function (config)
    {
        var shader = this.shaders[FX_CONST.WIPE];

        this.setShader(shader);

        this.wipe.onPreRender(config, shader);

        this.runDraw();
    },

    onBokeh: function (config, width, height)
    {
        var shader = this.shaders[FX_CONST.BOKEH];

        this.setShader(shader);

        this.bokeh.onPreRender(config, shader, width, height);

        this.runDraw();
    }

});

module.exports = FXPipeline;
