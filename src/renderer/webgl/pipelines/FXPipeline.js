/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var FX_CONST = require('../../../gameobjects/fx/const');
var GlowFrag = require('../shaders/FXGlow-frag.js');
var PixelateFrag = require('../shaders/FXPixelate-frag.js');
var PreFXPipeline = require('./PreFXPipeline');
var ShadowFrag = require('../shaders/FXShadow-frag.js');
var SingleQuadVS = require('../shaders/Single-vert.js');

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
        config.shaders = [
            { name: 'Glow', fragShader: GlowFrag, vertShader: SingleQuadVS },
            { name: 'Shadow', fragShader: ShadowFrag, vertShader: SingleQuadVS },
            { name: 'Pixelate', fragShader: PixelateFrag, vertShader: SingleQuadVS }
        ];

        PreFXPipeline.call(this, config);

        this.source;
        this.target;
        this.swap;
    },

    boot: function ()
    {
        PreFXPipeline.prototype.boot.call(this);

        console.log(this.shaders);
    },

    onDraw: function (target1, target2, target3)
    {
        this.source = target1;
        this.target = target2;
        this.swap = target3;

        var drawn = false;
        var sprite = this.tempSprite;

        if (sprite && sprite.fx)
        {
            for (var i = 0; i < sprite.fx.length; i++)
            {
                var fx = sprite.fx[i];

                if (fx.active)
                {
                    switch (fx.type)
                    {
                        case FX_CONST.GLOW:
                            this.onGlowDraw(fx);
                            drawn = true;
                            break;

                        case FX_CONST.SHADOW:
                            this.onShadowDraw(fx);
                            drawn = true;
                            break;

                        case FX_CONST.PIXELATE:
                            this.onPixelateDraw(fx);
                            drawn = true;
                            break;
                    }
                }
            }
        }

        if (!drawn)
        {
            this.source = target1;
        }

        this.drawToGame(this.source);
    },

    onGlowDraw: function (config)
    {
        var source = this.source;
        var target = this.target;

        this.setShader(this.shaders[FX_CONST.GLOW]);

        this.set1f('distance', config.distance);
        this.set1f('outerStrength', config.outerStrength);
        this.set1f('innerStrength', config.innerStrength);
        this.set4fv('glowColor', config._color);
        this.setBoolean('knockout', config.knockout);
        this.set2f('resolution', source.width, source.height);

        this.copy(source, target);

        this.source = target;
        this.target = source;
    },

    onShadowDraw: function (config)
    {
        var source = this.source;
        var target = this.target;

        this.setShader(this.shaders[FX_CONST.SHADOW]);

        this.set1i('samples', config.samples);
        this.set1f('intensity', config.intensity);
        this.set1f('decay', config.decay);
        this.set1f('power', config.power / config.samples);
        this.set2f('lightPosition', config.x, config.y);
        this.set4fv('color', config._color);

        this.copy(source, target);

        this.source = target;
        this.target = source;
    },

    onPixelateDraw: function (config)
    {
        var source = this.source;
        var target = this.target;

        this.setShader(this.shaders[FX_CONST.PIXELATE]);

        this.set1f('amount', config.amount);
        this.set2f('resolution', source.width, source.height);

        this.copy(source, target);

        this.source = target;
        this.target = source;
    },

    // onBloomDraw: function (target1, target2, target3)
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
