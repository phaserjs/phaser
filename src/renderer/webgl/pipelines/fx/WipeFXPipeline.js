/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var WipeFrag = require('../../shaders/FXWipe-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var WipeFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function WipeFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: WipeFrag
        });

        //  left to right: direction 0, axis 0
        //  right to left: direction 1, axis 0
        //  top to bottom: direction 1, axis 1
        //  bottom to top: direction 1, axis 0
        //  wipe: reveal 0
        //  reveal: reveal 1
        //  progress: 0 - 1

        this.progress = 0;
        this.wipeWidth = 0.1;
        this.direction = 0;
        this.axis = 0;
        this.reveal = false;
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        var progress = controller.progress;
        var wipeWidth = controller.wipeWidth;
        var direction = controller.direction;
        var axis = controller.axis;

        this.set4f('config', progress, wipeWidth, direction, axis, shader);
        this.setBoolean('reveal', controller.reveal, shader);
    }

});

module.exports = WipeFXPipeline;
