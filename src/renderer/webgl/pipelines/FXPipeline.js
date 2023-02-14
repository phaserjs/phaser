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
var VignetteFrag = require('../shaders/FXVignette-frag.js');
var GlowFXPipeline = require('./fx/GlowFXPipeline');

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
            { name: 'Pixelate', fragShader: PixelateFrag, vertShader: SingleQuadVS },
            { name: 'Vignette', fragShader: VignetteFrag, vertShader: SingleQuadVS }
        ];

        PreFXPipeline.call(this, config);

        var game = this.game;

        this.glow = new GlowFXPipeline(game);

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

        if (sprite && sprite.fx)
        {
            var fx = sprite.fx;

            for (var i = 0; i < fx.length; i++)
            {
                var config = fx[i];

                if (config.active)
                {
                    //  TODO - We can remove all of this by having an array
                    //  that maps the CONSTs to the onGlow, onShadow etc methods
                    switch (config.type)
                    {
                        case FX_CONST.GLOW:
                            this.onGlow(config, width, height);
                            break;

                        case FX_CONST.SHADOW:
                            this.onShadow(config, width, height);
                            break;

                        case FX_CONST.PIXELATE:
                            this.onPixelate(config, width, height);
                            break;

                        case FX_CONST.VIGNETTE:
                            this.onVignette(config, width, height);
                            break;
                    }
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

    onPixelate: function (config)
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

    onVignette: function (config)
    {
        var source = this.source;
        var target = this.target;

        // console.log(source, target);
        // debugger;

        this.setShader(this.shaders[FX_CONST.VIGNETTE]);

        this.set1f('strength', config.strength);

        this.copy(source, target);

        this.source = target;
        this.target = source;
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
