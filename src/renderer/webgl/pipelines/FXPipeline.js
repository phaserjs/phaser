/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BokehFrag = require('../shaders/FXBokeh-frag.js');
var BarrelFrag = require('../shaders/FXBarrel-frag.js');
var BlurHighFrag = require('../shaders/FXBlurHigh-frag.js');
var BlurLowFrag = require('../shaders/FXBlurLow-frag.js');
var BlurMedFrag = require('../shaders/FXBlurMed-frag.js');
var CircleFrag = require('../shaders/FXCircle-frag.js');
var DisplacementFrag = require('../shaders/FXDisplacement-frag.js');
var Class = require('../../../utils/Class');
var ColorMatrixFrag = require('../shaders/ColorMatrix-frag.js');
var FX_CONST = require('../../../gameobjects/fx/const');
var GetFastValue = require('../../../utils/object/GetFastValue');
var GlowFrag = require('../shaders/FXGlow-frag.js');
var PixelateFrag = require('../shaders/FXPixelate-frag.js');
var PreFXPipeline = require('./PreFXPipeline');
var ShadowFrag = require('../shaders/FXShadow-frag.js');
var ShineFrag = require('../shaders/FXShine-frag.js');
var VignetteFrag = require('../shaders/FXVignette-frag.js');
var GradientFrag = require('../shaders/FXGradient-frag.js');
var BloomFrag = require('../shaders/FXBloom-frag.js');
var WipeFrag = require('../shaders/FXWipe-frag.js');
var FX = require('../pipelines/fx');

/**
 * @classdesc
 *
 * @class FX
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
        //  TODO - Could get bundleshaders to create an index.js that
        //  exposes all of the fragment shaders, so we don't have to import each one

        //  This order is fixed to match with the FX_CONST. Do not adjust.
        config.shaders = [
            { fragShader: GlowFrag },
            { fragShader: ShadowFrag },
            { fragShader: PixelateFrag },
            { fragShader: VignetteFrag },
            { fragShader: ShineFrag },
            { fragShader: BlurLowFrag },
            { fragShader: BlurMedFrag },
            { fragShader: BlurHighFrag },
            { fragShader: GradientFrag },
            { fragShader: BloomFrag },
            { fragShader: ColorMatrixFrag },
            { fragShader: CircleFrag },
            { fragShader: BarrelFrag },
            { fragShader: DisplacementFrag },
            { fragShader: WipeFrag },
            { fragShader: BokehFrag }
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
        this.fxHandlers = [];

        this.fxHandlers[FX_CONST.GLOW] = this.onGlow;
        this.fxHandlers[FX_CONST.SHADOW] = this.onShadow;
        this.fxHandlers[FX_CONST.PIXELATE] = this.onPixelate;
        this.fxHandlers[FX_CONST.VIGNETTE] = this.onVignette;
        this.fxHandlers[FX_CONST.SHINE] = this.onShine;
        this.fxHandlers[FX_CONST.BLUR] = this.onBlur;
        this.fxHandlers[FX_CONST.GRADIENT] = this.onGradient;
        this.fxHandlers[FX_CONST.BLOOM] = this.onBloom;
        this.fxHandlers[FX_CONST.COLOR_MATRIX] = this.onColorMatrix;
        this.fxHandlers[FX_CONST.CIRCLE] = this.onCircle;
        this.fxHandlers[FX_CONST.BARREL] = this.onBarrel;
        this.fxHandlers[FX_CONST.DISPLACEMENT] = this.onDisplacement;
        this.fxHandlers[FX_CONST.WIPE] = this.onWipe;
        this.fxHandlers[FX_CONST.BOKEH] = this.onBokeh;

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

        if (sprite && sprite.fx)
        {
            var fx = sprite.fx;

            for (var i = 0; i < fx.length; i++)
            {
                var config = fx[i];

                if (config.active)
                {
                    handlers[config.type].call(this, config, width, height);
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
