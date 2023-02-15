/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlurHighFrag = require('../shaders/FXBlurHigh-frag.js');
var BlurLowFrag = require('../shaders/FXBlurLow-frag.js');
var BlurMedFrag = require('../shaders/FXBlurMed-frag.js');
var Class = require('../../../utils/Class');
var FX_CONST = require('../../../gameobjects/fx/const');
var GetFastValue = require('../../../utils/object/GetFastValue');
var GlowFrag = require('../shaders/FXGlow-frag.js');
var PixelateFrag = require('../shaders/FXPixelate-frag.js');
var PreFXPipeline = require('./PreFXPipeline');
var ShadowFrag = require('../shaders/FXShadow-frag.js');
var ShineFrag = require('../shaders/FXShine-frag.js');
var SingleQuadVS = require('../shaders/Single-vert.js');
var VignetteFrag = require('../shaders/FXVignette-frag.js');
var GradientFrag = require('../shaders/FXGradient-frag.js');

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
        var vertShader = SingleQuadVS;

        //  Order is fixed to match with the FX_CONST. Do not adjust.
        config.shaders = [
            { name: 'Glow', fragShader: GlowFrag, vertShader: vertShader },
            { name: 'Shadow', fragShader: ShadowFrag, vertShader: vertShader },
            { name: 'Pixelate', fragShader: PixelateFrag, vertShader: vertShader },
            { name: 'Vignette', fragShader: VignetteFrag, vertShader: vertShader },
            { name: 'Shine', fragShader: ShineFrag, vertShader: vertShader },
            { name: 'BlurLow', fragShader: BlurLowFrag, vertShader: vertShader },
            { name: 'BlurMed', fragShader: BlurMedFrag, vertShader: vertShader },
            { name: 'BlurHigh', fragShader: BlurHighFrag, vertShader: vertShader },
            { name: 'Gradient', fragShader: GradientFrag, vertShader: vertShader }
        ];

        PreFXPipeline.call(this, config);

        var manager = this.manager;

        this.glow = manager.getPostPipeline('GlowFX');
        this.shadow = manager.getPostPipeline('ShadowFX');
        this.pixelate = manager.getPostPipeline('PixelateFX');
        this.vignette = manager.getPostPipeline('VignetteFX');
        this.shine = manager.getPostPipeline('ShineFX');
        this.gradient = manager.getPostPipeline('GradientFX');

        //  This is a sparse array
        this.fxHandlers = [];

        this.fxHandlers[FX_CONST.GLOW] = this.onGlow;
        this.fxHandlers[FX_CONST.SHADOW] = this.onShadow;
        this.fxHandlers[FX_CONST.PIXELATE] = this.onPixelate;
        this.fxHandlers[FX_CONST.VIGNETTE] = this.onVignette;
        this.fxHandlers[FX_CONST.SHINE] = this.onShine;
        this.fxHandlers[FX_CONST.BLUR] = this.onBlur;
        this.fxHandlers[FX_CONST.GRADIENT] = this.onGradient;

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

    // onBloom: function (target1, target2, target3)
    // {
    //     this.manager.copyFrame(target1, target3);

    //     var x = (2 / target1.width) * this.offsetX;
    //     var y = (2 / target1.height) * this.offsetY;

    //     for (var i = 0; i < this.steps; i++)
    //     {
    //         this.set2f('uOffset', x, 0);
    //         this.copySprite(target1, target2);

    //         this.set2f('uOffset', 0, y);
    //         this.copySprite(target2, target1);
    //     }

    //     this.blendFrames(target3, target1, target2, this.strength);

    //     this.copyToGame(target2);
    // }

});

module.exports = FXPipeline;
