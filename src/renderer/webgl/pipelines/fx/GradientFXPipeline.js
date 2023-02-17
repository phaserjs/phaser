/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GradientFrag = require('../../shaders/FXGradient-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var GradientFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function GradientFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: GradientFrag
        });

        this.size = 0;
        this.alpha = 0.2;

        this.fromX = 0;
        this.fromY = 0;

        this.toX = 0;
        this.toY = 1;

        this.glcolor1 = [ 255, 0, 0 ];
        this.glcolor2 = [ 0, 255, 0 ];
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        this.set1f('alpha', controller.alpha, shader);
        this.set1i('size', controller.size, shader);
        this.set3fv('color1', controller.glcolor1, shader);
        this.set3fv('color2', controller.glcolor2, shader);
        this.set2f('positionFrom', controller.fromX, controller.fromY, shader);
        this.set2f('positionTo', controller.toX, controller.toY, shader);
    }

});

module.exports = GradientFXPipeline;
