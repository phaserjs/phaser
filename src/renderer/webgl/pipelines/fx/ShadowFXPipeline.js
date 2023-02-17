/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var ShadowFrag = require('../../shaders/FXShadow-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var ShadowFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ShadowFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: ShadowFrag
        });

        this.x = 0;
        this.y = 1;
        this.decay = 0.1;
        this.power = 1.0;
        this.glcolor = [ 0, 0, 0, 1 ];
        this.samples = 6;
        this.intensity = 1;
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        var samples = controller.samples;

        this.set1i('samples', samples, shader);
        this.set1f('intensity', controller.intensity, shader);
        this.set1f('decay', controller.decay, shader);
        this.set1f('power', (controller.power / samples), shader);
        this.set2f('lightPosition', controller.x, controller.y, shader);
        this.set4fv('color', controller.glcolor, shader);
    }

});

module.exports = ShadowFXPipeline;
