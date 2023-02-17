/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var ShineFrag = require('../../shaders/FXShine-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var ShineFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ShineFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: ShineFrag
        });

        this.speed = 0.5;
        this.lineWidth = 0.5;
        this.gradient = 3;
        this.reveal = false;
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.setTime('time', shader);

        this.set1f('speed', controller.speed, shader);
        this.set1f('lineWidth', controller.lineWidth, shader);
        this.set1f('gradient', controller.gradient, shader);
        this.setBoolean('reveal', controller.reveal, shader);

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

module.exports = ShineFXPipeline;
