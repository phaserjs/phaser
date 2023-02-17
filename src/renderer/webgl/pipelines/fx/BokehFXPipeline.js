/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BokehFrag = require('../../shaders/FXBokeh-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var BokehFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BokehFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: BokehFrag
        });

        this.isTiltShift = false;
        this.strength = 1;
        this.blurX = 1;
        this.blurY = 1;
        this.radius = 0.5;
        this.amount = 1;
        this.contrast = 0.2;
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.set1f('radius', controller.radius, shader);
        this.set1f('amount', controller.amount, shader);
        this.set1f('contrast', controller.contrast, shader);
        this.set1f('strength', controller.strength, shader);
        this.set2f('blur', controller.blurX, controller.blurY, shader);
        this.setBoolean('isTiltShift', controller.isTiltShift, shader);

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

module.exports = BokehFXPipeline;
