/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BarrelFrag = require('../../shaders/FXBarrel-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var BarrelFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BarrelFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: BarrelFrag
        });

        this.amount = 1;
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        this.set1f('amount', controller.amount, shader);
    }

});

module.exports = BarrelFXPipeline;
