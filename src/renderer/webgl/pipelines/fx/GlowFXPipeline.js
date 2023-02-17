/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GlowFrag = require('../../shaders/FXGlow-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var GlowFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function GlowFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: GlowFrag
        });

        this.distance = 10;
        this.outerStrength = 4;
        this.innerStrength = 0;
        this.knockout = false;
        this.glcolor = [ 1, 1, 1, 1 ];
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.set1f('distance', controller.distance, shader);
        this.set1f('outerStrength', controller.outerStrength, shader);
        this.set1f('innerStrength', controller.innerStrength, shader);
        this.set4fv('glowColor', controller.glcolor, shader);
        this.setBoolean('knockout', controller.knockout, shader);

        if (width && height)
        {
            this.set2f('resolution', width, height, shader);
        }
    },

    onDraw: function (target)
    {
        this.set2f('resolution', target.width, target.height);

        this.bindAndDraw(target);
    }

});

module.exports = GlowFXPipeline;
