/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BlurLowFrag = require('../../shaders/FXBlurLow-frag.js');
var BlurMedFrag = require('../../shaders/FXBlurMed-frag.js');
var BlurHighFrag = require('../../shaders/FXBlurHigh-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var BlurFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BlurFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            shaders: [
                {
                    name: 'Gaussian5',
                    fragShader: BlurLowFrag
                },
                {
                    name: 'Gaussian9',
                    fragShader: BlurMedFrag
                },
                {
                    name: 'Gaussian13',
                    fragShader: BlurHighFrag
                }
            ]
        });

        this.activeShader = this.shaders[0];

        this.x = 2;
        this.y = 2;
        this.steps = 4;
        this.strength = 1;
        this.glcolor = [ 1, 1, 1 ];
    },

    setQualityLow: function ()
    {
        this.activeShader = this.shaders[0];

        return this;
    },

    setQualityMedium: function ()
    {
        this.activeShader = this.shaders[1];

        return this;
    },

    setQualityHigh: function ()
    {
        this.activeShader = this.shaders[2];

        return this;
    },

    onDraw: function (target1)
    {
        var controller = this.getController();

        var gl = this.gl;
        var target2 = this.fullFrame1;

        this.bind(this.activeShader);

        gl.activeTexture(gl.TEXTURE0);
        gl.viewport(0, 0, target1.width, target1.height);

        this.set1i('uMainSampler', 0);
        this.set2f('resolution', target1.width, target1.height);
        this.set1f('strength', controller.strength);
        this.set3fv('color', controller.glcolor);

        for (var i = 0; i < controller.steps; i++)
        {
            this.set2f('offset', controller.x, 0);
            this.copySprite(target1, target2);

            this.set2f('offset', 0, controller.y);
            this.copySprite(target2, target1);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.copyToGame(target1);
    }

});

module.exports = BlurFXPipeline;
