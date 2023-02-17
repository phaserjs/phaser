/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var VignetteFrag = require('../../shaders/FXVignette-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var VignetteFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function VignetteFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: VignetteFrag
        });

        this.x = 0.5;
        this.y = 0.5;
        this.radius = 0.5;
        this.strength = 0.5;
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        this.set1f('radius', controller.radius, shader);
        this.set1f('strength', controller.strength, shader);
        this.set2f('position', controller.x, controller.y, shader);
    }

});

module.exports = VignetteFXPipeline;
