/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var PixelateFrag = require('../../shaders/FXPixelate-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var PixelateFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function PixelateFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: PixelateFrag
        });

        this.amount = 1;
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.set1f('amount', controller.amount, shader);

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

module.exports = PixelateFXPipeline;
